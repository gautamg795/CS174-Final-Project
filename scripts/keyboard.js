window.onkeydown = function(event) {
    app.keysPressed[event.keyCode] = true;
}
window.onkeyup = function(event) {
    app.keysPressed[event.keyCode] = false;
}

/**
 * Check which keys are being pressed and act accordingly.
 * Should be called once per frame in the game loop.
 */
function handleKeysPressed() {
	if (app.mode === GAMESTATE_PLAYING) {
		// for each key in app.keysPressed that is true
		// handle that key's action
		;
	}
	else {
		// Do something for the other game state(s)
	}
}