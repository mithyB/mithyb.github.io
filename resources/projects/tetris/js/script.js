var map = [];
var blockTypes = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 1]
    ],
    [
        [1, 1, 1, 1]
    ]
];

var fps = 66;
var pixelSize = 16;
var startSpeed = 500;
var topOffset = 2;

var prevTime = new Date();
var speedMultiplier = 1;
var fasterDown = 1;
var gameOver = false;
var score = 0;
var nextBlock;
var startTime;
var time;
var speed;

var mapWidth = 10;
var mapHeight = 22 + topOffset;
var nextWidth = Math.max.apply(Math, $.map(blockTypes, function (el) { return $.map(el, function (el2) { return el2.length })}));
var nextHeight = Math.max.apply(Math, $.map(blockTypes, function (el) { return el.length }));

var Block = function(data) {
    this.x = Math.floor(mapWidth / 2) - Math.floor(data[0].length / 2);
    this.y = 0;
    this.data = data;
}

var currentBlock;

function init() {
	var canvas = document.getElementById('canvas');
	canvas.width = pixelSize * mapWidth;
	canvas.height = pixelSize * (mapHeight - topOffset);
	
	var cvNext = document.getElementById('cvNext');
	cvNext.width = pixelSize * nextWidth;
	cvNext.height = pixelSize * nextHeight;

	setKeyBindings();
	load();
}

function load() {
	nextBlock = new Block(copy2DArray(blockTypes[Math.floor(Math.random() * blockTypes.length)]));
	initMap();
	drawScreen();
	drawNext(nextBlock.data);
	
	displayMessage('Ready?', 'Go!', 'start');
}

function start() {
	addBlock();	
	gameOver = false;	
	startTime = new Date();
	speed = startSpeed;
	score = 0;
	
	gameLoop();
}

function displayMessage(message, actionText, action) {
	var overlay = document.getElementById('overlay');
	var overlayMessage = document.getElementById('overlayMessage');
	var overlayAction = document.getElementById('overlayAction');
	
	overlay.style.visibility = 'visible';
	overlayMessage.innerHTML = message;
	overlayAction.innerHTML = actionText;
	overlayAction.href = 'javascript:run(' + action + ');';
}

function run(action) {
	overlay.style.visibility = 'collapse';
	action();
}

function initMap() {
	map = [];
	for (var y = 0; y < mapHeight; y++) {
		map.push([]);
		for (var x = 0; x < mapWidth; x++) {
			map[y].push(0);
		}
	}
}

function drawScreen() {
	for (var y = topOffset; y < mapHeight; y++) {
		for (var x = 0; x < mapWidth; x++) {
			if (map[y][x] == 1) {
				ctx.fillStyle = '#ccc';
			} else if (map[y][x] == 2) {
				ctx.fillStyle = '#aaa';
			} else {
				ctx.fillStyle = '#fff';
			}
			ctx.fillRect(x * pixelSize, (y - topOffset) * pixelSize, pixelSize, pixelSize);
		}
	}
}

function clearCurrentBlock() {
	for (var y = 0; y < mapHeight; y++) {
		for (var x = 0; x < mapWidth; x++) {
			if (map[y][x] == 1) {
				map[y][x] = 0;
			}
		}
	}
}

function gameLoop() {
	var milliseconds = new Date() - prevTime;

	updateMap(milliseconds);
	drawScreen();
	
	if (time) {
        speed = startSpeed / speedMultiplier;
        speedMultiplier = 1 + (time / 314150);
		
		document.getElementById('time').innerHTML = (time / 1000).toFixed(2) + 's';
		document.getElementById('speed').innerHTML = (speedMultiplier).toFixed(2) + 'x';
		document.getElementById('score').innerHTML = score;
	}
	
	if (!gameOver) {
		time = (new Date() - startTime);
		setTimeout(gameLoop, 1000 / fps);
	} else {

		//if (topScoreCount < 10 || score > lowestTopScore) {
			//highscore
		//}

		displayMessage('Game over!', 'Retry?', 'load');
	}
}

function updateMap(milliseconds) {
	if (milliseconds >= speed * fasterDown) {
		if (canMoveDown(currentBlock)) {
			currentBlock.y++;
		} else {
			setBlock(currentBlock);
			checkLines();
			addBlock();
		}
		prevTime = new Date();
	}
	
	clearCurrentBlock();	
	drawBlock(currentBlock);
}

function drawBlock(block) {
	for (var y = 0; y < block.data.length; y++) {
		for (var x = 0; x < block.data[0].length; x++) {
			if (block.y + y >= 0 && block.data[y][x] > 0) {
				map[block.y + y][block.x + x] = block.data[y][x];
			}
		}
	}
}

function checkLines() {
	for (var y = 0; y < mapHeight; y++) {
		var fieldCounter = 0;
		for (var x = 0; x < mapWidth; x++) {
			if (map[y][x] == 2) {
				fieldCounter++;
			}
		}
		
		if (fieldCounter == mapWidth) {
			moveDownRows(y);
			score += 1;
		}
	}
}

function moveDownRows(row) {
	for (var y = row; y >= 0; y--) {
		if (y - 1 >= 0) {
			map[y] = map[y - 1].slice(0);
		} else {
			for (var x = 0; x < mapWidth; x++) {
				map[y][x] = 0;
			}
		}		
	}
}

function doesOverlap(block) {
	for (var y = 0; y < block.data.length; y++) {
		for (var x = 0; x < block.data[0].length; x++) {
			if (block.y + y >= 0 && block.data[y][x] == 1 && map[block.y + y][block.x + x] == 2) {
				return true;
			}
		}
	}
	
	return false;
}

function canMoveHorizontal(block, amount) {
	var isBlocked = false;	
	var change = block.x + amount;
	
	for (var y = 0; y < block.data.length; y++) {
		var outerX;
		
		if (amount > 0) {
			for (var x = 0; x < block.data[0].length; x++) {
				if (block.data[y][x] == 1) {
					outerX = x;
				}
			}
		} else {
			for (var x = block.data[0].length - 1; x >= 0 ; x--) {
				if (block.data[y][x] == 1) {
					outerX = x;
				}
			}
		}
		
		if (block.y + y >= 0) {
			if (change + block.data[0].length - 1 >= mapWidth || change < 0 || 
				map[block.y + y][block.x + outerX + amount] == 2) {
				isBlocked = true;
			}
		}
	}	

	return !isBlocked;
}

function canMoveDown(block) {
	var isBlocked = false;
	for (var x = 0; x < block.data[0].length; x++) {
		var lastY;
		for (var y = 0; y < block.data.length; y++) {
			if (block.data[y][x] == 1) {
				lastY = y;
			}
		}
		
		if (block.y + block.data.length >= mapHeight || 
			map[block.y + lastY + 1][block.x + x] == 2) {
			isBlocked = true;
		}
	}

	return !isBlocked;
}

function setBlock(block) {
	for (var y = 0; y < block.data.length; y++) {
		for (var x = 0; x < block.data[0].length; x++) {
			if (block.data[y][x] == 1) {
				block.data[y][x] = 2;
			}
		}
	}
	
	drawBlock(block);
}

function addBlock() {
	var random = Math.floor(Math.random() * blockTypes.length);
	
	if (doesOverlap(nextBlock)){
		gameOver = true;
	} else {
		currentBlock = nextBlock;
	}
		
	nextBlock = new Block(copy2DArray(blockTypes[random]));	
	drawNext(nextBlock.data);	
}

function drawNext(data) {	
	for (var y = 0; y < nextHeight; y++) {
		for (var x = 0; x < nextWidth; x++) {
			if (y < data.length && x < data[0].length && data[y][x] == 1) {
				ctxNext.fillStyle = '#ccc';
				ctxNext.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
			} else {
				ctxNext.clearRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
			}		
			
		}
	}
}

function rotateBlock(block) {
	var originalData = block.data;
	block.data = rotateMatrix(block.data, -90);
	
	block.x += Math.floor(block.data.length / 2) - Math.floor(block.data[0].length / 2);
	block.y += Math.floor(block.data[0].length / 2) - Math.floor(block.data.length / 2);
	
	if (doesOverlap(block) || block.x + block.data[0].length > mapWidth || block.x < 0) {
		block.data = originalData;
	}
}

function shiftBlock(block, amount) {
	if (canMoveHorizontal(block, amount)) {
		block.x += amount;
	}
}

function copy2DArray(array) {
	var newArray = [];
	for (var y = 0; y < array.length; y++) {
		newArray.push([]);
		for (var x = 0; x < array[0].length; x++) {
			newArray[y].push(array[y][x]);
		}
	}
	
	return newArray;
}

function setKeyBindings() {
	window.addEventListener('keydown', function(e) {		
		switch (e.keyCode) {
			case 37: // left
				shiftBlock(currentBlock, -1);
				break;
			case 38: // up
				rotateBlock(currentBlock);
				break;
			case 39: // right
				shiftBlock(currentBlock, +1);
				break;
			case 40: // down
				fasterDown = 0.1;
				break;
			default: 
				console.log(e);
				break;
		}
	}, false);
	
	window.addEventListener('keyup', function(e) {
		switch (e.keyCode) {
			case 40: // down
                fasterDown = 1;
				break;
		}
	}, false);
}