/**
 * Multiplies matrix * vector
 * @param  {Matrix} u A n x n Matrix
 * @param  {Vector} v A n x 1 Vector
 * @return {Vector}   A n x 1 Vector
 */
function multMatVec(u, v) {
    var result = [];

    for (var i = 0; i < u.length; ++i) {
        var sum = 0;
        for (var j = 0; j < u.length; j++)
            sum += u[i][j] * v[j];
        result.push(sum);
    }
    return result;
}

/**
 * Polyfill for window.performance.now() for weird browsers
 */
(function() {

    if ("performance" in window == false) {
        window.performance = {};
    }

    Date.now = (Date.now || function() { // thanks IE8
        return new Date().getTime();
    });

    if ("now" in window.performance == false) {

        var nowOffset = Date.now();

        if (performance.timing && performance.timing.navigationStart) {
            nowOffset = performance.timing.navigationStart
        }

        window.performance.now = function now() {
            return Date.now() - nowOffset;
        }
    }

})();