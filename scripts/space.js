/**
 * Start rendering/ticking and drawing with drawSpace()
 */
function startPlaying() {
    if (app.mode != GAMESTATE_PLAYING) {
        app.mode = GAMESTATE_PLAYING;
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
 * Draw the space environment. Draws the spaceship, skybox, and planets
 * corresponding to the current level
 */
function drawSpace() {
    // do the drawing for all space objects
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    // update heading buffer
    app.headingBuffer.unshift(app.ship.heading);

    var pMatrix = perspective(50, canvas.width / canvas.height, app.camera.near, app.camera.far);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, flatten(pMatrix));
    // var viewMatrix = translate(add(app.camera.position, app.ship.position));
    // viewMatrix = mult(rotate(app.headingBuffer[4], [0, 1, 0]), viewMatrix);
    var eye = mult(rotate(-app.headingBuffer.pop()+180, [0, 1, 0]), translate(0, 10, 40));
    eye = mult(translate(app.ship.position), eye);
    eye = multMatVec(eye, vec4(0, 0, 0, 1)).slice(0, 3);
    var viewMatrix = lookAt(eye, vec3(app.ship.position[0], app.ship.position[1]+10, app.ship.position[2]), [0, 1, 0]);
    // Only need the next line if we end up switching shaders
    // gl.useProgram(shaderProgram)
    var mvMatrix = scale(0.05, 0.05, 0.05);
    mvMatrix = mult(rotate(-app.ship.heading+180, [0, 1, 0]), mvMatrix);
    mvMatrix = mult(translate(app.ship.position), mvMatrix);

    mvMatrix = mult(viewMatrix, mvMatrix);
    drawObject(app.models.spaceship, mvMatrix, app.models.spaceship.texture);
    app.levels[app.currentLevel].forEach(function(planet) {
        mvMatrix = scale(planet.size, planet.size, planet.size);
        mvMatrix = mult(translate(planet.position), mvMatrix);
        mvMatrix = mult(viewMatrix, mvMatrix);
        drawObject(app.models.planet, mvMatrix, app.models.planet.texture[planet.textureNum]);
    });

    gl.uniform1f(shaderProgram.textureScaleUniform, 8.0);
    mvMatrix = scale(6000, 6000, 6000);
    mvMatrix = mult(viewMatrix, mvMatrix);
    drawObject(app.models.skybox, mvMatrix, app.models.skybox.texture);
    gl.uniform1f(shaderProgram.textureScaleUniform, 1.0);
    moveShip();
    checkCollision();
    updateUI();
}

/**
 * Helper function for drawSpace()
 * @param  {Model} model    The model to be drawn
 * @param  {mat4} mvMatrix Model-view matrix associated with the model
 */
function drawObject(model, mvMatrix, texture) {
    gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, model.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.textureBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, model.mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.normalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, model.mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

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
    for (var i = 0; i < app.levels[0].length; i++) {
        // Calculate distance to planet
        distance = Math.pow(app.levels[0][i].position[0] - app.ship.position[0], 2) +
            Math.pow(app.levels[0][i].position[2] - app.ship.position[2], 2);
        // Compare against square of sum of radii
        if (distance <= Math.pow(25 + app.levels[0][i].size, 2)) {
            //TODO: "stopPlaying" but still make the try again button act as a 'R' press
            stopPlaying();
            $('#crashed-popup').css('display', 'block');
        }
    }

    //Calculate if ship is about to hit skybox
    if (25+ Math.abs(app.ship.position[0]) >= 3000 || 25 + Math.abs(app.ship.position[2]) >= 3000) {
        $('#crashed-popup').css('display', 'block');
        //Calculate if ship is about to hit skybox
        if (25 + Math.abs(app.ship.position[0]) >= 6000 || 25 + Math.abs(app.ship.position[2]) >= 6000) {
            stopPlaying();
        }
    }
}

function calculateAcceleration() {
    var thrustVector = vec3(app.ship.thrust / 60 * Math.sin(radians(-app.ship.heading)), 0, app.ship.thrust / 60 * Math.cos(radians(-app.ship.heading)));
    var gravityVector = [0.0, 0.0, 0.0];

    app.levels[app.currentLevel].forEach(function(planet) {
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