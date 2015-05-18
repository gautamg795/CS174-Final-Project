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
    aspect: undefined,
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
};

app.globalLight = {
    position: [0.0, 20.0, 0.0],
    ambient: [1.0, 1.0, 1.0, 1.0],
    diffuse: [1.0, 1.0, 1.0, 1.0],
    specular: [1.0, 1.0, 1.0, 1.0],
};

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
app.levels[0] = [
    {
        position: [110, 0, -20],
        size: .5,
        material: {
            ambient: [1.0, 1.0, 1.0, 1.0],
            diffuse: [1.0, 1.0, 1.0, 1.0],
            specular: [1.0, 1.0, 1.0, 1.0],
            shininess: 100.0
        },
        mass: 100,
    },
    {
        position: [-20, 0, -10],
        size: .1,
        material: {
            ambient: [1.0, 1.0, 1.0, 1.0],
            diffuse: [1.0, 1.0, 1.0, 1.0],
            specular: [1.0, 1.0, 1.0, 1.0],
            shininess: 100.0
        },
        mass: 100,
    },

];
