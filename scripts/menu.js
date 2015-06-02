$(document).ready(function() {
    $("#sensitivity-slider").parent().siblings(".option-value").text(app.rotationSensitivity);
    $("#texture-slider").parent().siblings(".option-value").text(app.textureQualityOptions[app.textureQuality]);

    // Menu button interactions
    $('#controls-button').click(function() {
        $('#controls-menu').css('display', 'block');
        $('#menu').hide();
    });
    $('#back-controls-button').click(function() {
        $('#menu').css('display', 'block');
        $('#controls-menu').hide();
    });
    $('#options-button').click(function() {
        $('#options-menu').css('display', 'block');
        $('#menu').hide();
    });
    $('#back-options-button').click(function() {
        $('#menu').css('display', 'block');
        $('#options-menu').hide();
    });

    // Option settings
    $("#sensitivity-slider").slider({
        value: app.rotationSensitivity,
        min: 0,
        max: 100,
        step: 10,
        slide: function(event, ui) {
            $("#sensitivity-slider").parent().siblings(".option-value").text(ui.value);
            app.rotationSensitivity = ui.value;
        }
    });

    $("#texture-slider").slider({
        value: app.textureQuality,
        min: 0,
        max: 4,
        step: 1,
        slide: function(event, ui) {
            $("#texture-slider").parent().siblings(".option-value").text(app.textureQualityOptions[ui.value]);
            app.textureQuality = ui.value;
            initTexture(app.models.spaceship, "assets/textures/ship-" + app.textureQuality + ".png");
        }
    });

    // quit button interaction
    $('.quit-button').click(resetApp);

    // crashed-popup buttons
    $('#crashed-try-again').click(function() {
        $('#crashed-popup').hide();
        $('#hud').hide();
        $('#mass-left').css('display', 'block');
        setMass(app.levels[app.currentLevel].massLeft);
        startPlaying();
        resetLevel(false);
    });

    // level-finished buttons
    $('#finished-level-next-level').click(function() {
        $('#finished-level-popup').hide();
        $('#hud').hide();
        $('#mass-left').css('display', 'block');
        setMass(app.levels[app.currentLevel].massLeft);
        app.currentLevel++;
        startPlaying();
        resetLevel(false);
    });

    $('#mass-continue-button').click(function() {
        app.mode = GAMESTATE_WAITING;
        $('#mass-left').hide();
        drawSpace();
        initMinimap(app.currentLevel);
        $('#hud').css('display', 'block');
        $('#start-game-popup').css('display', 'block');
    });

    $('#start-game-button').click(function() {
        app.mode = GAMESTATE_PLAYING;
        $('#start-game-popup').hide();
    });

    $('#skill-normal').click(function() {
        app.skill = MODE_NORMAL;
        $('#mass-bar-container').hide();

        $('#gl-canvas').css('display', 'block');
        $('#skill-menu').hide();
        $('#mass-left').css('display', 'block');
        startPlaying();
        resetLevel(false);
    });

    $('#skill-skilled').click(function() {
        app.skill = MODE_SKILL;
        $('#mass-bar-container').css('display', 'block');

        $('#gl-canvas').css('display', 'block');
        $('#skill-menu').hide();
        $('#mass-left').css('display', 'block');
        startPlaying();
        resetLevel(false);
    });
});

function everythingLoaded() {
    $("#start-button").removeAttr('style');
    $("#start-button").text("START");
    $('#start-button').click(function() {
        $('#menu').hide();
        $('#skill-menu').css('display', 'block');
    });
}

function initMinimap(level) {
    // Clear planets
    $("#minimap-planets").empty();

    // Initialize planets
    app.levels[level].planets.forEach(function(planet, i) {
        $("#minimap-planets").append("<div class='minimap-planet' id='minimap-planet-" + i + "'></div>");
        $("#minimap-planet-" + i).css("left", 25 + (200 - (planet.position[0] + 1000) / 10));
        $("#minimap-planet-" + i).css("top", 25 + (200 - (planet.position[2] + 1000) / 10));
        $("#minimap-planet-" + i).css("width", planet.size / 5);
        $("#minimap-planet-" + i).css("height", planet.size / 5);
    });

    // Initialize exit
    $("#minimap-exit").css("left", 25 + (200 - (app.levels[level].exit.position[0] + 1000) / 10));
    $("#minimap-exit").css("top", 25 + (200 - (app.levels[level].exit.position[2] + 1000) / 10));
}

/**
 * Updates the speedometer UI element
 * @param {float} val Arbitrary speed from 0 to 180
 */
function setSpeed(val) {
    // clamp val to [0, 180] range
    val = val < 0 ? 0 : (val > 180 ? 180 : val);
    $("#speed-needle").css("-webkit-transform", "rotate(" + val + "deg)");
    $("#speed-needle").css("-ms-transform", "rotate(" + val + "deg)");
    $("#speed-needle").css("-moz-transform", "rotate(" + val + "deg)");
    $("#speed-needle").css("transform", "rotate(" + val + "deg)");
}

/**
 * Updates the fuel gauge UI element
 * @param {float} pct Fuel amount from 0 to 100
 */
function setFuel(pct) {
    // clamp pct to [0, 100] range
    pct = pct < 0 ? 0 : (pct > 100 ? 100 : pct);
    $("#fuel-bar").css("-webkit-transform", "scale(1, " + pct / 100.0 + ")");
    $("#fuel-bar").css("-ms-transform", "scale(1, " + pct / 100.0 + ")");
    $("#fuel-bar").css("-moz-transform", "scale(1, " + pct / 100.0 + ")");
    $("#fuel-bar").css("transform", "scale(1, " + pct / 100.0 + ")");
    if (pct < 20 && $("#fuel-bar").css("background-color") != "rgb(255, 0, 0)") {
        $("#fuel-bar").css("background-color", "rgb(255, 0, 0)");
    }
}

/**
 * Updates the thrust UI element
 * @param {[float]} val Thrust from 0 to 100
 */
function setThrust(val) {
    // clamp val to [0, 100] range
    val = val < 0 ? 0 : (val > 100 ? 100 : val);
    $("#thrust-bar").css("-webkit-transform", "scale(1, " + val / 100.0 + ")");
    $("#thrust-bar").css("-ms-transform", "scale(1, " + val / 100.0 + ")");
    $("#thrust-bar").css("-moz-transform", "scale(1, " + val / 100.0 + ")");
    $("#thrust-bar").css("transform", "scale(1, " + val / 100.0 + ")");
}

/**
 * Updates the mass UI element
 * @param {[float]} val Mass from 0 to 500
 */
function setMass(val) {
    // clamp val to [0, 500] range
    val = val < 0 ? 0 : (val > 500 ? 500 : val);
    $("#mass-bar").css("-webkit-transform", "scale(1, " + val / 500.0 + ")");
    $("#mass-bar").css("-ms-transform", "scale(1, " + val / 500.0 + ")");
    $("#mass-bar").css("-moz-transform", "scale(1, " + val / 500.0 + ")");
    $("#mass-bar").css("transform", "scale(1, " + val / 500.0 + ")");
}

function setMinimap(posX, posZ, heading) {
    // Set position of ship on map
    var convertedX = 25 + (200 - (posX + 1000) / 10);
    var convertedZ = 25 + (200 - (posZ + 1000) / 10);
    $("#minimap-ship").css("left", convertedX);
    $("#minimap-ship").css("top", convertedZ);

    // Set rotation of ship on map
    $("#minimap-ship").css("-webkit-transform", "rotate(" + heading + "deg)");
    $("#minimap-ship").css("-ms-transform", "rotate(" + heading + "deg)");
    $("#minimap-ship").css("-moz-transform", "rotate(" + heading + "deg)");
    $("#minimap-ship").css("transform", "rotate(" + heading + "deg)");
}

/**
 * Updates the UI as part of the game loop
 */
function updateUI() {
    setSpeed(length(app.ship.velocity));
    setFuel(app.ship.fuel);
    setThrust(app.ship.thrust);
    setMinimap(app.ship.position[0], app.ship.position[2], app.ship.heading);
}