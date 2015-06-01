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
    shaderProgram.usesLighting = gl.getUniformLocation(shaderProgram, "usesLighting");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "vColor");
    shaderProgram.textureScaleUniform = gl.getUniformLocation(shaderProgram, "scale");
    shaderProgram.lightMatrix = gl.getUniformLocation(shaderProgram, "lightMatrix");

}

/**
 * Creates the vertex, normal, and texCoord buffers for each mesh.
 * Binds it and everything, so we don't have to do any of that ourselves
 */
function initBuffers() {
    // Initialize the mesh buffers,
    // then set app.models to contain the mesh
    // app.models will also contain other model data
    app.meshes["planet"] = initPlanet();
    for (mesh in app.meshes) {
        OBJ.initMeshBuffers(gl, app.meshes[mesh]);
        app.models[mesh] = {};
        app.models[mesh].mesh = app.meshes[mesh];
        app.models[mesh].num = Object.keys(app.models).length - 1;
    }
}

function initPlanet() {
    var mesh = {};
    var latitudeBands = 60;
    var longitudeBands = 60;
    var radius = 1;
    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];
    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);

            normalData.push(x);
            normalData.push(y);
            normalData.push(z);
            textureCoordData.push(u);
            textureCoordData.push(v);
            vertexPositionData.push(radius * x);
            vertexPositionData.push(radius * y);
            vertexPositionData.push(radius * z);
        }
    }
    var indexData = [];
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);

            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }

    function buildBuffer(gl, type, data, itemSize) {
        var buffer = gl.createBuffer();
        var arrayView = type === gl.ARRAY_BUFFER ? Float32Array : Uint16Array;
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, new arrayView(data), gl.STATIC_DRAW);
        buffer.itemSize = itemSize;
        buffer.numItems = data.length / itemSize;
        return buffer;
    }
    mesh.indices = indexData;
    mesh.textures = textureCoordData;
    mesh.vertexNormals = normalData;
    mesh.vertices = vertexPositionData;
    mesh.normalBuffer = buildBuffer(gl, gl.ARRAY_BUFFER, mesh.vertexNormals, 3);
    mesh.textureBuffer = buildBuffer(gl, gl.ARRAY_BUFFER, mesh.textures, 2);
    mesh.vertexBuffer = buildBuffer(gl, gl.ARRAY_BUFFER, mesh.vertices, 3);
    mesh.indexBuffer = buildBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, mesh.indices, 1);
    return mesh;
}

/**
 * Load the textures for the models and store them in app.models.*
 */
function initTextures() {
    initTexture(app.models.spaceship, "assets/textures/ship-" + app.textureQuality + ".png");
    console.log("Using ship-" + app.textureQuality + ".png");
    initTexture(app.models.skybox, "assets/textures/sky.jpg");
    initTexture(app.models.planet, ["assets/textures/moon.gif", "assets/textures/neptune.jpg", "assets/textures/nebula.png",
        "assets/textures/mercury.jpg", "assets/textures/jupiter.jpg", "assets/textures/earthy.jpg", "assets/textures/sun.jpg"
    ]);
    initTexture(app.models.exit, "assets/textures/exit-sign.png");
}

/**
 * Helper function for initTextures
 * Called once for each model
 * @param  {Model} object The model being textured
 * @param  {String} path   Relative path to the texture image
 */
function initTexture(object, path) {
    if (path.constructor === Array) {
        object.texture = [];
        for (var i = 0; i < path.length; i++) {
            ++app.textureCount;
            object.texture[i] = gl.createTexture();
            object.texture[i].image = new Image();
            object.texture[i].crossOrigin = "anonymous";
            // This is way hackier than it should be but javascript is dumb sometimes
            // in regards to how variable scope works with callbacks
            object.texture[i].image.i = i;
            object.texture[i].image.onload = function() {
                if (object.texture.constructor === Array)
                    handleLoadedTexture(object.texture[this.i]);
                else handleLoadedTexture(object.texture);
            }
            object.texture[i].image.src = path[i];
        }
        return;
    }
    ++app.textureCount;
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
    if (--app.textureCount == 0)
        everythingLoaded()
}