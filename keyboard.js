/**
 * Dictionary that we can use to check which keys are pressed. 
 * Doing things this way allows us to support multiple keys being pressed at once
 * @type {Object}
 */
var keysPressed = {};
window.onkeydown = function(event) {
    keysPressed[event.keyCode] = true;
}
window.onkeyup = function(event) {
    keysPressed[event.keyCode] = false;
}
