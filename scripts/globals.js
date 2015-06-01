/**
 * globals.js
 */

// enums
var X = 0,
    Y = 1,
    Z = 2;
var GAMESTATE_LOADING = 0,
    GAMESTATE_LOADED = 1,
    GAMESTATE_PLAYING = 2;
var gl;
var canvas;

var app = {};

app.camera = {
    position: [0.0, -12.0, -50.0],
    heading: 0.0,
    fovy: 50,
    near: .1,
    far: 80000.0
};
app.ship = {
    velocity: [0.0, 0.0, 0.0],
    position: [0.0, 0.0, -250],
    heading: 0.0,
    fuel: 100.0,
    thrust: 0.0,
    material: {
        ambient: [1.0, 1.0, 1.0, 1.0],
        diffuse: [1.0, 1.0, 1.0, 1.0],
        specular: [1.0, 1.0, 1.0, 1.0],
        shininess: 100.0
    },
    mass: 20,
    radius: 18,
    damping: false
};

app.headingBuffer = [0.0, 0.0, 0.0, 0.0, 0.0];

app.globalLight = {
    position: [0.0, 20.0, 0.0],
    ambient: [0.3, 0.3, 0.3, 0.3],
    diffuse: [1.0, 1.0, 1.0, 1.0],
    specular: [1.0, 1.0, 1.0, 1.0],
};
app.textureCount = 0;
app.rotationSensitivity = 50;
app.textureQualityOptions = ["Very Low", "Low", "Normal", "High", "Very High"];
app.textureQuality = 4;

app.models = {};
app.meshes = {};
app.textures = {};
app.levels = [];
app.currentLevel = 0;
app.keysPressed = {};
app.mode = GAMESTATE_LOADING;
app.elapsed = 0;
app.lastTime = window.performance.now();

// Set this variable to the current drawing function dependent on the mode (2d vs 3d)
app.drawScene = function() {};

// Level 1

//positive x is in the left direction
//positive z is into the screen
app.levels[0] = {
    planets: [{
        position: [-110, 0, -20],
        size: 50,
        material: {
            ambient: [1.0, 1.0, 1.0, 1.0],
            diffuse: [1.0, 1.0, 1.0, 1.0],
            specular: [1.0, 1.0, 1.0, 1.0],
            shininess: 100.0
        },
        textureNum: 0,
        mass: 300,
    }, {
        position: [20, 0, -10],
        size: 15,
        material: {
            ambient: [1.0, 1.0, 1.0, 1.0],
            diffuse: [1.0, 1.0, 1.0, 1.0],
            specular: [1.0, 1.0, 1.0, 1.0],
            shininess: 100.0
        },
        textureNum: 2,
        mass: 100,
    }, ],
    exit: {
        position: [200, 0, -10],
        theta: 0,
        size: 21,
    }
};