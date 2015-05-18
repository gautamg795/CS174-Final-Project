$(document).ready(function() {
    $('#start-button').click(function() {
        $('#gl-canvas').css('display', 'block');
        $('#hud').css('display', 'block');
        $('#menu').hide();
        startPlaying();
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
}

function updateUI() {
    setSpeed(length(app.ship.velocity));
    setFuel(app.ship.fuel);
}