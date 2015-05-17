function initGL(c) {
    gl = WebGLUtils.setupWebGL(c);
    gl.viewport(0, 0, c.width, c.height);
}

/**
 * Gets the shaders from the HTML and compiles them into @var [shaderProgram]
 * Sets up the vertex attribute arrays and uniforms, storing their locations into the program variable
 */
function initAllShaders() {
    shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "projection");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "modelView");
}

function initBuffers() {

}

function initPlanet() {

}

function initTextures() {

}