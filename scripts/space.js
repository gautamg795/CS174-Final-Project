/**
 * I didn't know what to call this file; feel free to rename
 */

function startPlaying()
{
    app.mode = GAMESTATE_PLAYING;
    app.drawScene = drawSpace;
    tick();
}

function stopPlaying()
{
    app.mode = GAMESTATE_LOADED;
    app.drawScene = function() {};
    cancelAnimationFrame(app.animFrame);
}

function drawSpace()
{
    // do the drawing for all space objects
}