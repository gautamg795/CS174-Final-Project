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
        slide: function( event, ui ) {
            $("#sensitivity-slider").parent().siblings(".option-value").text(ui.value);
            app.rotationSensitivity = ui.value;
        }
    });

    $("#texture-slider").slider({
        value: app.textureQuality,
        min: 0,
        max: 4,
        step: 1,
        slide: function( event, ui ) {
            $("#texture-slider").parent().siblings(".option-value").text(app.textureQualityOptions[ui.value]);
            app.textureQuality = ui.value;
        }
    });
});

function everythingLoaded() {
    $("#start-button").removeAttr('style');
    $("#start-button").text("START");
    $('#start-button').click(function() {
        $('#gl-canvas').css('display', 'block');
        $('#hud').css('display', 'block');
        $('#menu').hide();
        startPlaying();
    });
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
 * Updates the UI as part of the game loop
 */
function updateUI() {
    setSpeed(length(app.ship.velocity));
    setFuel(app.ship.fuel);
    setThrust(app.ship.thrust);
}