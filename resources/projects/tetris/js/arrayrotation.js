// made by Mr. Polywhirl
// stackoverflow: http://stackoverflow.com/questions/42519/how-do-you-rotate-a-two-dimensional-array
// jsfiddle: http://jsfiddle.net/MrPolywhirl/NH42z/

Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
}

var rotateMatrix = function (matrix, direction) {
    direction = direction.mod(360) || 0;

    var deepCopy = function (obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var out = [],
                i = 0,
                len = obj.length;
            for (; i < len; i++) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        if (typeof obj === 'object') {
            var out = {}, i;
            for (i in obj) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        return obj;
    }

    var ret = deepCopy(matrix);

    // Does not work with non-square matricies.
    var transpose1 = function (m) {
        for (var i = 0; i < m.length; i++) {
            for (var j = i; j < m[0].length; j++) {
                var x = m[i][j];
                m[i][j] = m[j][i];
                m[j][i] = x;
            }
        }
        return m;
    };

    // Too slow, builds new array THEN fills in the values.
    var transpose2 = function (m) {
        var result = arrayFilled(m.length, m[0].length, 0);
        for (var i = 0; i < m.length; i++) {
            for (var j = 0; j < m[0].length; j++) {
                result[j][i] = m[i][j];
            }
        }
        return result;
    };

    // Efficiently builds and fills values at the same time.
    var transpose3 = function (m) {
        var result = new Array(m[0].length);
        for (var i = 0; i < m[0].length; i++) {
            result[i] = new Array(m.length - 1);
            for (var j = m.length - 1; j > -1; j--) {
                result[i][j] = m[j][i];
            }
        }
        return result;
    };

    var transpose = function (m) {
        if (m.length === m[0].length) {
            return transpose1(m);
        } else {
            return transpose3(m);
        }
    };

    var reverseRows = function (m) {
        //for (var i = 0, k = m.length - 1; i < k; ++i, --k) {
        //    var x = m[i];
        //    m[i] = m[k];
        //    m[k] = x;
        //}
        //return m;
        return m.reverse();
    };

    var reverseCols = function (m) {
        for (var i = 0; i < m.length; i++) {
            //for (var j = 0, k = m[i].length - 1; j < k; ++j, --k) {
            //    var x = m[i][j];
            //    m[i][j] = m[i][k];
            //    m[i][k] = x;
            //}
            m[i].reverse();
        }
        return m;
    };

    var rotate90Left = function (m) {
        m = transpose(m);
        m = reverseRows(m);
        return m;
    };

    var rotate90Right = function (m) {
        m = reverseRows(m);
        m = transpose(m);
        return m;
    };

    var rotate180 = function (m) {
        m = reverseCols(m);
        m = reverseRows(m);
        return m;
    };

    if (direction == 90 || direction == -270) {
        return rotate90Left(ret);
    } else if (direction == -90 || direction == 270) {
        return rotate90Right(ret);
    } else if (Math.abs(direction) == 180) {
        return rotate180(ret);
    }

    return matrix;
};