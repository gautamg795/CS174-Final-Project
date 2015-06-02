window.onkeydown = function(event) {
    app.keysPressed[event.keyCode] = true;
}
window.onkeyup = function(event) {
    app.keysPressed[event.keyCode] = false;
}

$("#gl-canvas").mousedown(function(event) {
    if(app.skill == MODE_SKILL){
        app.keysPressed[-1] = true;
        var x = event.offsetX;
        var y = event.offsetY;

        x = (x / canvas.width) - 0.5;
        x = (x * 1000 * canvas.width / canvas.height) + 300; 

        y = (y / canvas.height) - 0.5;
        y *= 1000;

        var nPlanets = app.levels[app.currentLevel].planets.length;
        app.levels[app.currentLevel].nPlanetsAdded++;
        app.levels[app.currentLevel].planets.push({
            position: [-y, 0, x],
            size: 0,
            textureNum: Math.floor(Math.random() * app.planetTextures.length),
            mass: 0,
        })

        checkPlacementCollision();
        var nPlanetsAfter = app.levels[app.currentLevel].planets.length;
        if(nPlanetsAfter > nPlanets)
            app.sounds["placePlanet"].play();

    }
});

$("#gl-canvas").mouseup(function(event) {
    app.keysPressed[-1] = undefined;
});

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
            app.ship.heading += app.rotationSensitivity / 50;
            if (app.ship.heading > 180)
                app.ship.heading -= 360;
        }

        // Left arrow key
        if (app.keysPressed[37] === true) {
            app.ship.heading -= app.rotationSensitivity / 50;
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

        // z
        if (app.keysPressed[90] === true) {
            if (app.ship.damping)
                return;
            app.ship.damping = true;
            app.ship.thrust = 0;
            if (app.ship.fuel <= 0)
                return;
            var finalFuel = app.ship.fuel - length(app.ship.velocity) / 8;
            var finalX = 0,
                finalY = 0,
                finalZ = 0;
            if (finalFuel < 0) {
                var offset = Math.abs(finalFuel) * 8;
                var norm = normalize(vec3(app.ship.velocity));
                finalX += offset * norm[0];
                finalY += offset * norm[1];
                finalZ += offset * norm[2];
            }
            $({
                x: app.ship.velocity[0],
                y: app.ship.velocity[1],
                z: app.ship.velocity[2],
                fuel: app.ship.fuel
            }).animate({
                x: finalX,
                y: finalY,
                z: finalZ,
                fuel: finalFuel
            }, {
                duration: (300 * Math.log(length(app.ship.velocity)) + 80),
                step: function() {
                    app.ship.velocity = [this.x, this.y, this.z];
                    app.ship.fuel = this.fuel;
                },
                complete: function() {
                    app.ship.damping = false;
                }
            });
        }

        // r
        if (app.keysPressed[82] === true) {
            resetLevel();
        }
    }
    else if (app.mode == GAMESTATE_PLACING) {
        //mouse click
        if (app.skill == MODE_SKILL){
            if (app.keysPressed[-1] !== undefined){

                app.levels[app.currentLevel].planets[app.levels[app.currentLevel].planets.length - 1].mass += 6.0;
                app.levels[app.currentLevel].massLeft -= 6.0;
                app.levels[app.currentLevel].planets[app.levels[app.currentLevel].planets.length - 1].size += 1.0;

                if (app.levels[app.currentLevel].massLeft <= 0) {
                    //TODO: DISPLAY READY BUTTON AND WAIT FOR INPUT
                    app.mode = GAMESTATE_WAITING;
                    drawSpace();

                    //put the button for ready (or timer) here, on click, set to GAMESTATE_PLAYING
                    $('#start-game-popup').css('display', 'block');
                }

                checkPlacementCollision();
                setMass(app.levels[app.currentLevel].massLeft);
            } 
        }
    }
    else
        ;
        // Do something for the other game state(s)
}