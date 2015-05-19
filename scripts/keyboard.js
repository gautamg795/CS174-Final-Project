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

        // Right arrow key
        if (app.keysPressed[39] === true) {
            app.ship.heading++;
            if (app.ship.heading > 180)
                app.ship.heading -= 360;
        }

        // Left arrow key
        if (app.keysPressed[37] === true) {
            app.ship.heading--;
            if (app.ship.heading < -180)
                app.ship.heading += 360;
        }

        // Up arrow key
        if (app.keysPressed[38] === true) {
            if (app.ship.fuel > 0 && app.ship.thrust < 100)
                app.ship.thrust++;
        }

        // Down arrow key
        if (app.keysPressed[40] === true) {
            if (app.ship.thrust > 0)
                app.ship.thrust--;
        }

        // x
        if (app.keysPressed[88] === true) {
            app.ship.thrust = 0;
        }

        if (app.keysPressed[90] === true) {
            app.ship.thrust = 0;
            var finalFuel = app.ship.fuel - length(app.ship.velocity) / 8;
            $({
                x: app.ship.velocity[0],
                y: app.ship.velocity[1],
                z: app.ship.velocity[2],
                fuel: app.ship.fuel
            }).animate({
                x: 0,
                y: 0,
                z: 0,
                fuel: finalFuel
            }, {
                duration: 1500,
                step: function() {
                    app.ship.velocity = [this.x, this.y, this.z];
                    app.ship.fuel = this.fuel;
                }
            });
        }
    } else {
        // Do something for the other game state(s)
    }
}