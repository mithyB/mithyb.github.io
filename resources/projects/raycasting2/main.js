var $location = angular.element(document).injector().get('$location');
var $route = angular.element(document).injector().get('$route');

window.onload = function () {
    document.getElementById('pixelSize').value = pixelSize;
    document.getElementById('floorEnabled').checked = floorEnabled == 1;
    document.getElementById('textureEnabled').checked = textureEnabled == 1;
};

var pixelSize = 3;
var floorEnabled = 1;
var textureEnabled = 1;

readPageParameter();

function readPageParameter() {
    if ($location.search().p) {
        pixelSize = parseInt($location.search().p);
    }
    if ($location.search().f != undefined) {
        floorEnabled = $location.search().f == 1;
    }
    if ($location.search().t != undefined) {
        textureEnabled = $location.search().t == 1;
    }

    document.getElementById('pixelSize').value = pixelSize;
    document.getElementById('floorEnabled').checked = floorEnabled == 1;
    document.getElementById('textureEnabled').checked = textureEnabled == 1;
}

function applyInput() {
    $location.search('p', parseInt(document.getElementById('pixelSize').value));
    $location.search('f', document.getElementById('floorEnabled').checked ? 1 : 0);
    $location.search('t', document.getElementById('textureEnabled').checked ? 1 : 0);

    $route.reload();
}

init(pixelSize, floorEnabled == 1, textureEnabled == 1);