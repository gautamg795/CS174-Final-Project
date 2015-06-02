/**
 * globals.js
 */

// enums
var X = 0,
    Y = 1,
    Z = 2;
var GAMESTATE_LOADING = 0,
    GAMESTATE_LOADED = 1,
    GAMESTATE_PLAYING = 2,
    GAMESTATE_PLACING = 3,
    GAMESTATE_WAITING = 4,
    MODE_NORMAL = 5,
    MODE_SKILL = 6;
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
    mass: 20,
    size: 18,
    damping: false
};

app.headingBuffer = [0.0, 0.0, 0.0, 0.0, 0.0];

app.textureCount = 0;
app.rotationSensitivity = 50;
app.textureQualityOptions = ["Very Low", "Low", "Normal", "High", "Very High"];
app.textureQuality = 4;

app.models = {};
app.meshes = {};
app.planetTextures = ["assets/textures/moon.gif", "assets/textures/neptune.jpg", "assets/textures/nebula.png",
    "assets/textures/mercury.jpg", "assets/textures/jupiter.jpg", "assets/textures/earthy.jpg", "assets/textures/sun.jpg"
];
app.sounds = {};
app.levels = [];
app.currentLevelNum = 0;
app.currentLevel = {};
app.score = 0;
app.keysPressed = {};
app.mode = GAMESTATE_LOADING;
app.skill = MODE_NORMAL;

app.theta = 0;
app.elapsed = 0;
app.lastTime = window.performance.now();

// Set this variable to the current drawing function dependent on the mode (2d vs 3d)
app.drawScene = function() {};

var fuelSize = 22;

// Level 1
//positive x is in the left direction
//positive z is into the screen
app.levels[0] = {
    planets: [{
        position: [0, 0, -20],
        size: 50,
        textureNum: 0,
        mass: 300,
    }],
    exit: {
        position: [0, 0, 200],
        size: 21,
    },
    fuel: [],
    massLeft: 500,
};

app.levels[1] = {
    planets: [{
        position: [180, 0, 0],
        size: 40,
        textureNum: 2,
        mass: 240,
    }, {
        position: [-120, 0, 400],
        size: 133,
        textureNum: 6,
        mass: 800,
    }],
    exit: {
        position: [160, 0, 200],
        size: 21,
    },
    fuel: [{
        position: [-120, 0, 900],
        collected: false,
        size: fuelSize,
    }, ],
    massLeft: 500,
};