window.onload = function () {
    document.getElementById('pixelSize').value = pixelSize;
    document.getElementById('floorEnabled').checked = floorEnabled == 1 ? true : false;
    document.getElementById('textureEnabled').checked = textureEnabled == 1 ? true : false;
}

var pixelSize = 3;
var floorEnabled = 1;
var textureEnabled = 1;

readPageParameter();

function readPageParameter() {
    var query = window.location.search.substring(1);
    var paramsList = query.split('&');

    for (var i = 0; i < paramsList.length; i++) {
        var param = paramsList[i].split('=');
        if (param[0] == 'p') {
            pixelSize = parseInt(param[1]);
        } else if (param[0] == 'f') {
            floorEnabled = param[1] == 'true' ? 1 : 0;
        } else if (param[0] == 't') {
            textureEnabled = param[1] == 'true' ? 1 : 0;
        }
    }
}

function applyInput() {
    var pParam = 'p=' + parseInt(document.getElementById('pixelSize').value);
    var fParam = 'f=' + document.getElementById('floorEnabled').checked;
    var tParam = 't=' + document.getElementById('textureEnabled').checked;

    window.location.href = window.location.pathname + '?' + pParam + '&' + fParam + '&' + tParam;
}

init(pixelSize, floorEnabled == 1, textureEnabled == 1);