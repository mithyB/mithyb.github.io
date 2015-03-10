var $location = angular.element(document).injector().get('$location');
var $route = angular.element(document).injector().get('$route');

var mouseDown = false;
ctx.globalCompositionOperation = "source-over";
canvas.addEventListener('mousemove', ctxOnClick, false);
window.addEventListener('keydown', function(e) {
    if (e.keyCode == '68') {
        var cursorPos = mousePos;

        var field = getFieldAtMouse(pf.resultFields);
        if (!field) {
            field = getFieldAtMouse(pf.openFields);
            if (!field) {
                field = getFieldAtMouse(pf.checkedFields);
            }
        }
        console.log(field);
        console.log('F: ' + field.getF() + ', G: ' + field.getG() + ', H: ' + field.getH());
    }
}, false);

window.onload = function () {
    document.getElementById('gridSize').value = gridSize - 2;
    document.getElementById('size').value = size;
}

canvas.onmousedown = function (e) {
    var field = getCursorPosition(e);
    var hex = getHexColorOfField(field);
    if (hex == '#000000') {
        drawMode = 'space';
        if (isEditAllowed(field)) {
            drawField(field, 'white');
        }
    } else if (hex == '#ffffff' || hex == '#1e90ff') {
        drawMode = 'obstacle';
        if (isEditAllowed(field)) {
            drawField(field, 'black');
        }
    } else if (hex == '#008000') {
        drawMode = 'start';
    } else if (hex == '#ff0000') {
        drawMode = 'end';
    } else {
        console.log(hex);
    }

    mouseDown = true;
};
canvas.onmouseup = function () {
    mouseDown = false;
};

function getFieldAtMouse(list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].x == mousePos.x && list[i].y == mousePos.y) {
            return list[i];
        }
    }
}

function mouse(x, y) {
    this.x = x;
    this.y = y;
}

var size = 8;
var gridSize = 16 + 2;
var drawMode = 'obstacle';

readPageParameter();

canvas.width = size * gridSize;
canvas.height = size * gridSize;

var pf = new pathfinding();

drawGrid();

function readPageParameter() {
    if ($location.search().g) {
        gridSize = parseInt($location.search().g) + 2;
    }
    if ($location.search().s) {
        size = parseInt($location.search().s);
    }

    document.getElementById('gridSize').value = gridSize - 2;
    document.getElementById('size').value = size;
}

function startPathfinding() {
    clearFieldsIn('#1e90ff');
    pf = new pathfinding();
    var startX = 0, startY = 0, endX = 0, endY = 0;
    for (var y = 0; y < gridSize; y++) {
        for (var x = 0; x < gridSize; x++) {
            var c = ctx.getImageData(x * size, y * size, 1, 1).data;
            var hex = "#" + ("000000" + rgbToHex(c[0], c[1], c[2])).slice(-6);

            if (hex == '#000000') {
                pf.obstacleFields.push(new window.field(x, y, null));
            } else if (hex == '#008000') {
                startX = x;
                startY = y;
            } else if (hex == '#ff0000') {
                endX = x;
                endY = y;
            }
        }
    }

    pf.setStart(startX, startY);
    pf.setEnd(endX, endY);

    pf.init();

    var fields = pf.resultFields;

    //	drawPath(pf.checkedFields, '#bbf');
    //	drawPath(pf.openFields, '#ccf');

    if (fields[0].x == endX && fields[0].y == endY) {
        drawPath(fields, 'dodgerblue');
    } else {
        alert('no path possible');
    }
}

function applyInput() {
    $location.search('g', parseInt(document.getElementById('gridSize').value));
    $location.search('s', parseInt(document.getElementById('size').value));

    $route.reload();
}

function drawGrid() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var y = 0; y < gridSize; y++) {
        for (var x = 0; x < gridSize; x++) {
            ctx.fillStyle = 'white';
            //ctx.strokeStyle = 'black';
            //ctx.strokeRect(x * size, y * size, size, size);
            ctx.fillRect(x * size, y * size, size, size);

            if (x == 0 || y == 0 || x == gridSize - 1 || y == gridSize - 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(x * size, y * size, size, size);
            }
        }
    }

    ctx.fillStyle = 'green';
    ctx.fillRect(2 * size, gridSize / 2 * size, size, size);

    ctx.fillStyle = 'red';
    ctx.fillRect((gridSize - 3) * size, gridSize / 2 * size, size, size);
}

function drawPath(fields, color) {
    for (var i = 1; i < fields.length - 1; i++) {
        ctx.fillStyle = color;
        ctx.fillRect(fields[i].x * size, fields[i].y * size, size, size);

        //console.log(fields[i]);
        //console.log('F: ' + fields[i].getF() + ', G: ' + fields[i].getG() + ', H: ' + fields[i].getH());
    }
}

function ctxOnClick(e) {
    if (window.mouseDown) {
        var field = getCursorPosition(e);

        if (isEditAllowed(field)) {
            var hex = getHexColorOfField(field);

            if (hex == '#ffffff' && drawMode == 'start') {
                clearFieldsIn('#008000');
                drawField(field, 'green');
            } else if (hex == '#ffffff' && drawMode == 'end') {
                clearFieldsIn('#ff0000');
                drawField(field, 'red');
            } else if ((hex == '#ffffff' || hex == '#1e90ff') && drawMode == 'obstacle') {
                drawField(field, 'black');
            } else if (hex == '#000000' && drawMode == 'space') {
                drawField(field, 'white');
            }
        }
    }

    mousePos = new mouse(getCursorPosition(e).x, getCursorPosition(e).y);
}

function isEditAllowed(field) {
    return !(field.x == 0 || field.y == 0 || field.x == gridSize - 1 || field.y == gridSize - 1);
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function getCursorPosition(e) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    var cv = document.getElementById('canvas');
    x -= cv.offsetLeft;
    y -= cv.offsetTop;

    var field = new window.field(Math.floor(x / size), Math.floor(y / size), null);
    return field;
}

function getHexColorOfField(field) {
    var c = ctx.getImageData(field.x * size, field.y * size, 1, 1).data;
    return "#" + ("000000" + rgbToHex(c[0], c[1], c[2])).slice(-6);
}

function drawField(field, color) {
    ctx.fillStyle = color;
    ctx.fillRect(field.x * size, field.y * size, size, size);
}

function clearFieldsIn(color) {
    for (var y = 0; y < gridSize; y++) {
        for (var x = 0; x < gridSize; x++) {
            var field = new window.field(x, y, null);
            if (getHexColorOfField(field) == color && isEditAllowed(field)) {
                drawField(field, 'white');
            }
        }
    }
}