ctx.globalCompositionOperation = "source-over";

window.onload = function () {
    //document.getElementById('size').value = size;
}

var size = 16;

readPageParameter();
init();

function readPageParameter() {
    var query = window.location.search.substring(1);
    var paramsList = query.split('&');

    for (var i = 0; i < paramsList.length; i++) {
        var param = paramsList[i].split('=');
        if (param[0] == 's') {
            size = parseInt(param[1]);
        }
    }
}

function applyInput() {
    var sParam = 's=' + parseInt(document.getElementById('size').value);

    window.location.href = window.location.pathname + '?' + sParam;
}