(function (moduleId, ng) {
    'use strict';

    var app = ng.module(moduleId, [
        'ngRoute',
        'audio-player',
        module
    ]);

    function module() {

    }

    app.run(['$route', main]);

    function main($route) {
        //$route.reload();
    }

})('app', angular);