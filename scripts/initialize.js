function initGL() {
    gl = WebGLUtils.setupWebGL(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
}

/**
 * Gets the shaders from the HTML and compiles them into @var [shaderProgram]
 * Sets up the vertex attribute arrays and uniforms, storing their locations into the program variable
 */
function initAllShaders() {
    // NOTE: These functions might cause warnings in your console--this is because the GLSL compiler
    // optimizes out unused variables, so the unused vNormal and vTexCoord don't actually exist yet
    // This is OK.
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
    shaderProgram.hasTexture = gl.getUniformLocation(shaderProgram, "hasTexture");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "vColor");
}

/**
 * Creates the vertex, normal, and texCoord buffers for each mesh.
 * Binds it and everything, so we don't have to do any of that ourselves
 */
function initBuffers() {
    // Initialize the mesh buffers,
    // then set app.models to contain the mesh
    // app.models will also contain other model data
    for (mesh in app.meshes) {
        OBJ.initMeshBuffers(gl, app.meshes[mesh]);
        app.models[mesh] = {};
        app.models[mesh].mesh = app.meshes[mesh];
        app.models[mesh].num = Object.keys(app.models).length - 1;
    }
}

/**
 * Load the textures for the models and store them in app.models.*
 */
function initTextures() {
    // initTexture(app.models.spaceship, "assets/textures/some_texture.jpg");
    initTexture(app.models.planet, "assets/textures/moon.gif");
    initTexture(app.models.skybox, "assets/textures/sky.jpg");
}

/**
 * Helper function for initTextures
 * Called once for each model
 * @param  {Model} object The model being textured
 * @param  {String} path   Relative path to the texture image
 */
function initTexture(object, path) {
    object.texture = gl.createTexture();
    object.texture.image = new Image();
    object.texture.image.crossOrigin = "anonymous";
    object.texture.image.onload = function() {
        handleLoadedTexture(object.texture);
    }
    object.texture.image.src = path;
}

function handleLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // Good practice to leave the active texture unbound
    gl.bindTexture(gl.TEXTURE_2D, null);
}
