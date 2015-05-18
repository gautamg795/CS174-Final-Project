$(document).ready(function() {
    $('#start-button').click(function() {
        $('#gl-canvas').css('display', 'block');
        $('#hud').css('display', 'block');
        $('#menu').hide();
        startPlaying();
    });
    $('#controls-button').click(function() {
        $('#controls-menu').css('display', 'block');
        $('#menu').hide();
    });
    $('#back-button').click(function() {
        $('#menu').css('display', 'block');
        $('#controls-menu').hide();
    });
});

/**
 * Updates the speedometer UI element
 * @param {float} val Arbitrary speed from 0 to 180
 */
function setSpeed(val) {
    // clamp val to [0, 180] range
    val = val < 0 ? 0 : (val > 180 ? 180 : val);
    $("#speed-needle").css("-webkit-transform", "rotate(" + val + "deg)");
}

/**
 * Updates the fuel gauge UI element
 * @param {float} pct Fuel amount from 0 to 100
 */
function setFuel(pct) {
    // clamp pct to [0, 100] range
    pct = pct < 0 ? 0 : (pct > 100 ? 100 : pct);
    $("#fuel-bar").css("-webkit-transform", "scale(1, " + pct/100.0 + ")");
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
    $("#thrust-bar").css("-webkit-transform", "scale(1, " + val/100.0 + ")");
}

/**
 * Updates the UI as part of the game loop
 */
function updateUI() {
    setSpeed(length(app.ship.velocity));
    setFuel(app.ship.fuel);
    setThrust(app.ship.thrust);
}