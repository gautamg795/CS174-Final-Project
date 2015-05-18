/**
 * I didn't know what to call this file; feel free to rename
 */

/**
 * Start rendering/ticking and drawing with drawSpace()
 */
function startPlaying() {
    app.mode = GAMESTATE_PLAYING;
    app.drawScene = drawSpace;
    app.lastTime = window.performance.now();
    requestAnimFrame(tick);
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
    var pMatrix = perspective(50, canvas.width / canvas.height, 0.1, 1000.0);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, flatten(pMatrix));
    var viewMatrix = mult(rotate(app.camera.heading, [0, 1, 0]), translate(app.camera.position));
    // Only need the next line if we end up switching shaders
    // gl.useProgram(shaderProgram)
    var mvMatrix = scale(0.05, 0.05, 0.05);
    mvMatrix = mult(rotate(app.ship.heading, [0, 1, 0]), mvMatrix);
    mvMatrix = mult(translate(app.ship.position), mvMatrix);
    mvMatrix = mult(viewMatrix, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, flatten(mvMatrix));

    drawObject(app.models.spaceship, mvMatrix);


    updateUI();
}

/**
 * Helper function for drawSpace()
 * @param  {Model} model    The model to be drawn
 * @param  {mat4} mvMatrix Model-view matrix associated with the model
 */
function drawObject(model, mvMatrix) {
    gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, model.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.textureBuffer);
    // gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, model.mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.normalBuffer);
    // gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, model.mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Uncomment once textures are in initAllShaders and initTextures
    // if ('texture' in model) {
    //     // TODO: rewrite this to take advantage of different texture units
    //     gl.activeTexture(gl.TEXTURE0);
    //     gl.bindTexture(gl.TEXTURE_2D, model.texture);
    //     gl.uniform1i(shaderProgram.texSamplerUniform);
    // }

    // TODO: Send lighting/material data
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, flatten(mvMatrix));
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.mesh.indexBuffer);
    gl.drawElements(gl.TRIANGLES, model.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}