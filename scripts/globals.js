/**
 * globals.js
 */

// enums
var X = 0, Y = 1, Z = 2;
var GAMESTATE_LOADING = 0, GAMESTATE_LOADED = 1, GAMESTATE_PLAYING = 2;
var gl;
var canvas;

var app = {};

app.camera = {
    position: [0.0, -12.0, -25.0],
    heading: 0.0,
    fovy: 50,
    aspect: undefined,
    near: 1.0,
    far: 300.0
};
app.ship = {
    velocity: [0.0, 0.0, 0.0],
    acceleration: [0.0, 0.0, 0.0],
    position: [0.0, 0.0, 0.0],
    heading: 0.0,
    fuel: 100.0,
    thrust: 0.0
};
app.models = {};
app.meshes = {};
app.textures = {};
app.levels = {};
app.keysPressed = {};
app.mode = GAMESTATE_LOADING;
app.elapsed = 0;
app.lastTime = window.performance.now();

// Set this variable to the current drawing function dependent on the mode (2d vs 3d)
app.drawScene = function() {};

