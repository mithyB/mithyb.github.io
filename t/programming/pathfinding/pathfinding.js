var _startX;
var _startY;
var _endX;
var _endY; 
var _cost = 10;
var _diaCost = 14;

function field(x, y, parent) {
    this.x = x;
    this.y = y;
    this.parent = parent;

    this.getG = function() {
        if (this.parent != null) {
            if (this.parent.x == this.x || this.parent.y == this.y) {
                return this.parent.getG() + window._cost;
            } else {
                return this.parent.getG() + window._diaCost;
            }
        }
        return 0;
    }

    this.getH = function() {
		return (Math.abs(window._endX - this.x) + Math.abs(window._endY - this.y)) * window._cost;
    }

    this.getF = function() {
        return this.getG() + this.getH();
    }
}

function pathfinding() {
    this.openFields = [];
    this.checkedFields = [];
    this.currentNeighbors = [];
    this.obstacleFields = [];
    this.resultFields = [];

    this.init = function () {
        var startField = new window.field(window._startX, window._startY, null);
        this.openFields.push(startField);
        this.findPath(startField);
    }

    this.setStart = function(x, y) {
        _startX = x;
        _startY = y;
    }

    this.setEnd = function (x, y) {
        _endX = x;
        _endY = y;
    }

    this.findPath = function(currentField) {
        this.checkedFields.push(currentField);
        var fieldIndex = this.openFields.indexOf(currentField);
        this.openFields.splice(fieldIndex, 1);

        this.createNewNeighborFields(currentField);
        this.recalculateGCostOfNeighbors(currentField);

        var chosenField = this.getBestField();

        this.currentNeighbors = [];
        if (!(currentField.x == window._endX && currentField.y == window._endY) && chosenField != null) {
            this.findPath(chosenField);
        } else {
            this.drawPath(currentField);
        }
    }

    this.recalculateGCostOfNeighbors = function (currentField) {
        if (currentField.parent != null) {
            for (var i = 0; i < this.currentNeighbors.length; i++) {
                var oldParent = currentField.parent;
                var oldG = currentField.getG();

                if (this.isFieldInOpenList(this.currentNeighbors[i].parent)) {
                    currentField.parent = this.currentNeighbors[i];
                }

                if (currentField.getG() > oldG) {
                    currentField.parent = oldParent;
                }
            }
        }
    }

    this.createNewNeighborFields = function(currentField) {
        for (var x = 1; x >= -1; x--) {
            for (var y = 1; y >= -1; y--) {
                var newField = new window.field(currentField.x + x, currentField.y + y, currentField);

                if ((!(x == 0 && y == 0)) && this.isFree(newField)) {
                    if (x == 0 || y == 0 || this.isDiagonalPossible(currentField, x, y)) {
                        if (this.isFieldInOpenList(newField) == false) {
                            this.currentNeighbors.push(newField);
                            this.openFields.push(newField);
                        } else {
                            this.currentNeighbors.push(this.getNewNeighbor(newField));
                        }
                    }
                }
            }
        }
    }

    this.isDiagonalPossible = function(currentField, x, y) {
        if (Math.abs(x) == Math.abs(y)) {
            for (var i = 0; i < this.obstacleFields.length; i++) {
                var obstacle = this.obstacleFields[i];
                if (obstacle.x == currentField.x + x && obstacle.y == currentField.y ||
                    obstacle.x == currentField.x && obstacle.y == currentField.y + y) {
                    return false;
                }
            }
        }
        return true;
    }

    this.getNewNeighbor = function(currentField) {
        for (var i = 0; i < this.openFields.length; i++) {
            if (this.openFields[i].x == currentField.x && this.openFields[i].y == currentField.y) {
                return this.openFields[i];
            }
        }
    }

    this.isFieldInOpenList = function(field) {
        for (var i = 0; i < this.openFields.length; i++) {
            if (this.openFields[i].x == field.x && this.openFields[i].y == field.y) {
                return true;
            }
        }
        return false;
    }

    this.isFree = function(field) {
        var returnValue = true;

        for (var i = 0; i < this.obstacleFields.length; i++) {
            if (this.obstacleFields[i].x == field.x && this.obstacleFields[i].y == field.y) {
                returnValue = false;
            }
        }

        for (var i = 0; i < this.checkedFields.length; i++) {
            if (this.checkedFields[i].x == field.x && this.checkedFields[i].y == field.y) {
                returnValue = false;
            }
        }

        return returnValue;
    }

    this.getBestField = function() {
        var bestField = null;

        for (var i = 0; i < this.currentNeighbors.length; i++) {
            if (bestField == null || this.currentNeighbors[i].getF() < bestField.getF()) {
                bestField = this.currentNeighbors[i];
            }
        }

        for (var i = 0; i < this.openFields.length; i++) {
            if (bestField == null || this.openFields[i].getF() < bestField.getF()) {
                bestField = this.openFields[i];
            }
        }

        return bestField;
    }

    this.drawPath = function (currentField) {
        this.resultFields.push(currentField);

        if (!(currentField.x == window._startX && currentField.y == window._startY)) {
            this.drawPath(currentField.parent);
        }
    }
}