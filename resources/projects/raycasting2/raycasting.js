var DEG_TO_RAD = Math.PI / 180;
var RAD_TO_DEG = 180 / Math.PI;

var map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //16x16
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

var wallTex = [
    ['#888', '#888', '#888', '#888', '#888', '#888', '#888', '#888'],
    ['#888', '#aaa', '#aaa', '#aaa', '#888', '#aaa', '#aaa', '#aaa'],
    ['#888', '#aaa', '#aaa', '#aaa', '#888', '#aaa', '#aaa', '#aaa'],
    ['#888', '#aaa', '#aaa', '#aaa', '#888', '#aaa', '#aaa', '#aaa'],
    ['#888', '#888', '#888', '#888', '#888', '#888', '#888', '#888'],
    ['#888', '#aaa', '#aaa', '#aaa', '#888', '#aaa', '#aaa', '#aaa'],
    ['#888', '#aaa', '#aaa', '#aaa', '#888', '#aaa', '#aaa', '#aaa'],
    ['#888', '#aaa', '#aaa', '#aaa', '#888', '#aaa', '#aaa', '#aaa']
];

var floorTex = [
    ['#888', '#888', '#888', '#888', '#888', '#888', '#888', '#888'],
    ['#888', '#aaa', '#aaa', '#aaa', '#888', '#aaa', '#aaa', '#aaa'],
    ['#888', '#aaa', '#aaa', '#aaa', '#888', '#aaa', '#aaa', '#aaa'],
    ['#888', '#aaa', '#aaa', '#aaa', '#888', '#aaa', '#aaa', '#aaa'],
    ['#888', '#888', '#888', '#888', '#888', '#888', '#888', '#888'],
    ['#888', '#aaa', '#aaa', '#aaa', '#888', '#aaa', '#aaa', '#aaa'],
    ['#888', '#aaa', '#aaa', '#aaa', '#888', '#aaa', '#aaa', '#aaa'],
    ['#888', '#aaa', '#aaa', '#aaa', '#888', '#aaa', '#aaa', '#aaa']
];

var fps = 66;
var fov = 66 * DEG_TO_RAD;

var textureSize = 64;
var pixelSize = 4;
var floorEnabled = true;
var loadImageTextures = false;
var mapWidth = 0;
var mapHeight = 0;
var miniMapScale = 4;
var screenWidth;
var screenHeight;

//                      walk
var angleLookup = [
    [-135, 180, 135],   //-1
    [-90, 0, 90],       //0
    [-45, 0, 45]        //1
//     -1  0  1     <- strave
];

var player = {
    x: 7.5,
    y: 8.5,
    dir: 0,
    rot: 270 * DEG_TO_RAD,
    walk: 0,
    strave: 0,
    moveSpeed: 0.05,
    rotSpeed: 3 * DEG_TO_RAD,
    size: 0.2
};

function init(pSize, fEnabled, tEnabled) {
    pixelSize = pSize;
    floorEnabled = fEnabled;
    loadImageTextures = tEnabled;
    screenWidth = canvas.width / pixelSize;
    screenHeight = canvas.height / pixelSize;

    if (loadImageTextures) {
        textureSize = 64;
    } else {
        textureSize = 8;
    }

    bindKeys();

    mapWidth = map[0].length;
    mapHeight = map.length;

    gameCycle();
};

function gameCycle() {
    ctx.clearRect(0, 0, screenWidth * pixelSize, screenHeight * pixelSize);
    ctx.fillStyle = '#ddf';
    ctx.fillRect(0, 0, screenWidth * pixelSize, screenHeight * pixelSize);
    move();
    castRays();
    //updateMiniMap();
    setTimeout(gameCycle, 1000 / fps);
}

function castRays() {
    var sliceIdx = 0;
    var angleDif = fov / screenWidth;

    for (var i = -fov / 2; i < fov / 2; i += angleDif) {
        castSingleRay(player.rot + i, sliceIdx++);
    }
}

function castSingleRay(angle, column) {
    angle %= 2 * Math.PI;
    if (angle < 0) {
        angle += 2 * Math.PI;
    }

    var right = (angle > 270 * DEG_TO_RAD || angle < 90 * DEG_TO_RAD);
    var up = (angle > 180 * DEG_TO_RAD);

    var angleSin = Math.sin(angle), angleCos = Math.cos(angle);

    var dist = 0;
    var xHit = 0, yHit = 0;
    var textureX;

    var facing;

    var slope = angleSin / angleCos;
    var dX = right ? 1 : -1;
    var dY = dX * slope;

    var x = right ? Math.ceil(player.x) : Math.floor(player.x);
    var y = player.y + (x - player.x) * slope;

    while (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
        var wallX = Math.floor(x + (right ? 0 : -1));
        var wallY = Math.floor(y);

        if (map[wallY][wallX] > 0) {
            var distX = x - player.x;
            var distY = y - player.y;

            dist = distX * distX + distY * distY;
            textureX = y % 1;

            if (!right) {
                textureX = 1 - textureX;
            }

            xHit = x;
            yHit = y;
            break;
        }

        x += dX;
        y += dY;
    }

    slope = angleCos / angleSin;
    dY = up ? -1 : 1;
    dX = dY * slope;
    y = up ? Math.floor(player.y) : Math.ceil(player.y);
    x = player.x + (y - player.y) * slope;

    while (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
        var wallY = Math.floor(y + (up ? -1 : 0));
        var wallX = Math.floor(x);

        if (map[wallY][wallX] > 0) {
            var distX = x - player.x;
            var distY = y - player.y;
            var blockDist = distX * distX + distY * distY;

            if (!dist || blockDist < dist) {
                dist = blockDist;
                xHit = x;
                yHit = y;
                facing = 'EW';
                textureX = x % 1;
                if (up) {
                    textureX = 1 - textureX;
                }
            }
            break;
        }
        x += dX;
        y += dY;
    }

    if (dist) {
        dist = Math.sqrt(dist) * Math.cos(player.rot - angle);
        //drawLine(player.x * miniMapScale, player.y * miniMapScale, xHit * miniMapScale, yHit * miniMapScale);
        drawRay(xHit, yHit, column, textureX, dist, facing);
    }
}

function drawRay(xWall, yWall, column, offset, dist, facing) {
    var distToProjection = (screenWidth / 2) / Math.tan(fov / 2);
    var sliceHeight = 1 / dist * distToProjection;
    sliceHeight -= sliceHeight % 2;
    if (loadImageTextures) {
        ctx.drawImage(document.getElementById('wall'), offset * 63, 0, 1, 64, column * pixelSize, screenHeight * pixelSize / 2 - sliceHeight * pixelSize / 2, pixelSize, sliceHeight * pixelSize);
    } else {
        for (var i = 0; i < sliceHeight; i++) {
            var xTex = Math.floor(offset * (textureSize - 1));
            var yTex = Math.floor(i / sliceHeight * textureSize);
            ctx.fillStyle = wallTex[yTex][xTex];
            ctx.fillRect(column * pixelSize, (screenHeight / 2 - sliceHeight / 2 + i) * pixelSize, pixelSize, pixelSize);
        }
    }
    if (facing == 'EW') {
        ctx.fillStyle = "rgba(0, 0, 0, .2)";
        ctx.fillRect(column * pixelSize, screenHeight * pixelSize / 2 - sliceHeight * pixelSize / 2, pixelSize, sliceHeight * pixelSize);
    }

    if (floorEnabled) {
        var topEdge = screenHeight / 2 - sliceHeight / 2;
        var bottomEdge = screenHeight / 2 + sliceHeight / 2;
        bottomEdge -= bottomEdge % 1;

        for (var h = bottomEdge; h < screenHeight; h++) {
            drawFloor(xWall, yWall, column, h, dist);
        }
    }
}

function drawFloor(xWall, yWall, x, y, distWall) {
    var dist = screenHeight / (2 * y - screenHeight) * 1.25;
    var weight = dist / distWall;

    var currentFloorX = weight * xWall + (1 - weight) * player.x;
    var currentFloorY = weight * yWall + (1 - weight) * player.y;

    var floorTexX = (currentFloorX * textureSize) % textureSize;
    var floorTexY = (currentFloorY * textureSize) % textureSize;

    floorTexX = Math.abs(floorTexX - floorTexX % 1);
    floorTexY = Math.abs(floorTexY - floorTexY % 1);

    if (loadImageTextures) {
        ctx.drawImage(document.getElementById('floor'), floorTexX, floorTexY, 1, 1, x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    } else {
        ctx.fillStyle = floorTex[floorTexY][floorTexX];
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
}

function move() {
    player.rot += player.dir * player.rotSpeed;

    var walkStep = player.moveSpeed;
    if (Math.abs(player.walk) + Math.abs(player.strave) < 1) {
        walkStep = 0;
    }

    var dir = player.rot + angleLookup[player.walk + 1][player.strave + 1] * DEG_TO_RAD;

    var newX = player.x + Math.cos(dir) * walkStep;
    var newY = player.y + Math.sin(dir) * walkStep;

    if (!isBlockingX(newX)) {
        player.x = newX;
    }
    if (!isBlockingY(newY)) {
        player.y = newY;
    }
}

function isBlockingX(x) {
    if (x < 0 || x >= mapWidth) {
        return true;
    }

    return map[Math.floor(player.y)][Math.floor(x + player.size)] != 0 ||
        map[Math.floor(player.y)][Math.floor(x - player.size)] != 0;
}

function isBlockingY(y) {
    if (y < 0 || y >= mapHeight) {
        return true;
    }

    return map[Math.floor(y + player.size)][Math.floor(player.x)] != 0 ||
        map[Math.floor(y - player.size)][Math.floor(player.x)] != 0;
}

function updateMiniMap() {
    drawMiniMap();
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x * miniMapScale - 1, player.y * miniMapScale - 1, 2, 2);

    drawLine(player.x * miniMapScale, player.y * miniMapScale, (player.x + Math.cos(player.rot)) * miniMapScale, (player.y + Math.sin(player.rot)) * miniMapScale);
}

function drawMiniMap() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, mapWidth * miniMapScale, mapHeight * miniMapScale);
    for (var y = 0; y < mapHeight; y++) {
        for (var x = 0; x < mapWidth; x++) {
            var wall = map[y][x];

            if (wall > 0) {
                ctx.fillStyle = '#bbb';
                ctx.fillRect(x * miniMapScale, y * miniMapScale, miniMapScale, miniMapScale);
            }
        }
    }
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}

function bindKeys() {
    document.onkeydown = function(e) {
        e = e || window.event;

        switch (e.keyCode) {
            case 37: //arrow left
                player.dir = -1;
                break;
            case 38: //arrow up
                break;
            case 39: //arrow right
                player.dir = 1;
                break;
            case 40: //arrow down
                break;
            case 65: //a
                player.strave = -1;
                break;
            case 68: //d
                player.strave = 1;
                break;
            case 83: //s
                player.walk = -1;
                break;
            case 87: //w
                player.walk = 1;
                break;
        }
    }

    document.onkeyup = function(e) {
        e = e || window.event;
        switch(e.keyCode) {
            case 37: //arrow left
            case 39: //arrow right
                player.dir = 0;
                break;
            case 38: //arrow up
            case 40: //arrow down
                break;
            case 65: //a
            case 68: //d
                player.strave = 0;
                break;
            case 83: //s
            case 87: //w
                player.walk = 0;
                break;
        }
    }
}