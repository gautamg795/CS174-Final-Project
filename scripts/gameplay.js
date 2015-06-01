/**
 * Start rendering/ticking and drawing with drawSpace()
 */
function startPlaying() {
    if (app.mode != GAMESTATE_PLAYING) {
        app.mode = GAMESTATE_PLACING;
        app.drawScene = drawSpace;
        app.lastTime = window.performance.now();
        requestAnimFrame(tick);
    }
}

/**
 * Stop rendering/ticking
 * Used for end of level or end of game score screen
 */
function stopPlaying() {
    app.mode = GAMESTATE_LOADED;
    app.drawScene = function() {};
    cancelAnimationFrame(app.animFrame);
}

/**
 * Reset the current level to its original state
 */
function resetLevel() {
    $("#fuel-bar").css("background-color", "rgb(255, 255, 255)");
    app.ship.velocity = [0.0, 0.0, 0.0];
    app.ship.position = [0.0, 0.0, -250];
    app.ship.fuel = 100.0;
    app.ship.thrust = 0.0;
    app.ship.heading = 0;
    app.headingBuffer = [0, 0, 0, 0, 0];
}

/**
 * Reset the entire game, bringing you back to the menu
 * Does not reset user settings by design
 */
function resetApp() {
    stopPlaying();
    app.currentLevel = 0;
    resetLevel();
    $('#crashed-popup').hide();
    $('#gl-canvas').hide();
    $('#hud').hide();
    $('#menu').css('display','block');
}

/**
 * Draw the space environment. Draws the spaceship, skybox, and planets
 * corresponding to the current level
 */
function drawSpace() {
    // do the drawing for all space objects
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    // update heading buffer
    app.headingBuffer.unshift(app.ship.heading);

    //var pMatrix = perspective(50, canvas.width / canvas.height, app.camera.near, app.camera.far);
    var pMatrix = ortho(-500 * canvas.width / canvas.height, 500 * canvas.width / canvas.height, -500, 500, -500, 500);
    var extraMatrix = mult(translate(-450, 0, 0), rotate(-90, [0, 0, 1]));
    extraMatrix = mult(extraMatrix, rotate(90, [1, 0, 0]));
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, flatten(mult(pMatrix, extraMatrix)));

    var viewMatrix = translate(app.camera.position);
    gl.uniformMatrix4fv(shaderProgram.lightMatrix, false, flatten(viewMatrix));
    var rotMatrix = rotate(app.headingBuffer.pop() - app.ship.heading, [0, 1, 0]);
    var modelMatrix = mult(rotMatrix, scale(0.05, 0.05, 0.05));

    var mvMatrix = mult(viewMatrix, modelMatrix);

    drawObject(app.models.spaceship, mvMatrix, app.models.spaceship.texture, false);

    app.levels[app.currentLevel].planets.forEach(function(planet) {
        modelMatrix = scale(planet.size, planet.size, planet.size);
        modelMatrix = mult(translate(app.ship.position), modelMatrix);
        modelMatrix = mult(translate(scaleVec(-1, planet.position)), modelMatrix);
        modelMatrix = mult(rotate(app.ship.heading, [0, 1, 0]), modelMatrix);
        mvMatrix = mult(viewMatrix, modelMatrix);
        drawObject(app.models.planet, mvMatrix, app.models.planet.texture[planet.textureNum], true);
    });

    modelMatrix = mult(scale(.1, .1, .1), rotate((app.levels[app.currentLevel].exit.theta += app.elapsed / 10), [0, 1, 0]));
    modelMatrix = mult(translate(app.ship.position), modelMatrix);
    modelMatrix = mult(translate(negate(app.levels[app.currentLevel].exit.position)), modelMatrix);
    modelMatrix = mult(rotate(app.ship.heading, [0, 1, 0]), modelMatrix);
    mvMatrix = mult(viewMatrix, modelMatrix);
    drawObject(app.models.exit, mvMatrix, app.models.exit.texture, false);

    gl.uniform1f(shaderProgram.textureScaleUniform, 8.0);
    modelMatrix = mult(translate(app.ship.position), scale(6000, 6000, 6000));
    modelMatrix = mult(rotate(app.ship.heading, [0, 1, 0]), modelMatrix);
    mvMatrix = mult(viewMatrix, modelMatrix);
    drawObject(app.models.skybox, mvMatrix, app.models.skybox.texture, false);
    gl.uniform1f(shaderProgram.textureScaleUniform, 1.0);
    //Only move the ship if playing. (dont move if placing mass)
    if (app.mode == GAMESTATE_PLAYING){
        moveShip();
        checkCollision();
    }
    updateUI();
}

/**
 * Helper function for drawSpace()
 * @param  {Model} model    The model to be drawn
 * @param  {mat4} mvMatrix Model-view matrix associated with the model
 */
function drawObject(model, mvMatrix, texture, lighting) {
    gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, model.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.textureBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, model.mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.normalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, model.mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.uniform1i(shaderProgram.usesLighting, lighting);
    if (texture) {
        gl.activeTexture(gl.TEXTURE0 + model.num);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(shaderProgram.samplerUniform, model.num);
        gl.uniform1i(shaderProgram.hasTexture, true);
    } else
        gl.uniform1i(shaderProgram.hasTexture, false);

    // TODO: Send lighting/material data
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, flatten(mvMatrix));
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.mesh.indexBuffer);
    gl.drawElements(gl.TRIANGLES, model.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

/**
 * Moves the ship as per its acceleration
 * Uses Euler's method to calculate ∆x and ∆v
 */
function moveShip() {
    // Increment position by x = v*dt
    // Divide dt just to make it smaller 
    for (var i = 0; i < 3; i++) {
        app.ship.position[i] += app.ship.velocity[i] * app.elapsed / 1000.0;
    }
    // Decrement fuel proportionally to your thrust (1000 is just an arbitrary constant that works for now)
    app.ship.fuel -= app.ship.thrust / 1000.0;
    // No fuel == no thrust
    if (app.ship.fuel <= 0)
        app.ship.thrust = 0;
    // TODO: Calculate the acceleration vectors from all planets
    // Calculate the acceleration created by the ship's thrust
    // (How do we find a vector for the ship's thrust based off of its heading?)
    // Add them together; alter velocity by v = a * dt like below
    var accelVector = calculateAcceleration();
    for (var i = 0; i < 3; i++) {
        app.ship.velocity[i] += accelVector[i] * app.elapsed / 120.0;
    }
}

// IN PROGRESS
function checkCollision() {
    // Loop through all planet positions and check against ship position
    var distance;
    for (var i = 0; i < app.levels[0].planets.length; i++) {
        // Calculate distance to planet
        distance = Math.pow(app.levels[0].planets[i].position[0] - app.ship.position[0], 2) +
            Math.pow(app.levels[0].planets[i].position[2] - app.ship.position[2], 2);
        // Compare against square of sum of radii
        if (distance <= Math.pow(app.ship.radius + app.levels[0].planets[i].size, 2)) {
            crash();
        }
    }

    //Calculate if ship is nearing skybox
    if (app.ship.radius + Math.abs(app.ship.position[0]) >= 3000 || app.ship.radius + Math.abs(app.ship.position[2]) >= 3000) {
        // Show warning popup at this point?
        //Calculate if ship is hitting skybox
        if (app.ship.radius + Math.abs(app.ship.position[0]) >= 6000 || app.ship.radius + Math.abs(app.ship.position[2]) >= 6000) {
            crash();
        }
    }
}

/**
 * Called whenever the ship has crashed.
 * If we decide to add an explosion, do that here
 */
function crash() {
    stopPlaying();
    $('#crashed-popup').css('display', 'block');
}

/**
 * Calculates the acceleration on the ship as a combination of
 * thrust and gravity
 * @return {vec3} Acceleration vector
 */
function calculateAcceleration() {
    var thrustVector = vec3(app.ship.thrust / 60 * Math.sin(radians(-app.ship.heading)), 0, app.ship.thrust / 60 * Math.cos(radians(-app.ship.heading)));
    var gravityVector = [0.0, 0.0, 0.0];

    app.levels[app.currentLevel].planets.forEach(function(planet) {
        var vec_to_planet = subtract(vec3(planet.position), vec3(app.ship.position));
        var unit_vec = normalize(vec_to_planet, false);
        var dist_squared = dot(vec_to_planet, vec_to_planet);
        var gravity_mag = 0.0001 * planet.mass * app.ship.mass / dist_squared;
        gravityVector[0] += unit_vec[0] * gravity_mag;
        gravityVector[1] += unit_vec[1] * gravity_mag;
        gravityVector[2] += unit_vec[2] * gravity_mag;
    });
    return add(thrustVector, gravityVector);
}