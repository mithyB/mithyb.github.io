(function (moduleId, factoryId, ng) {
    'use strict';

    ng.module(moduleId).factory(factoryId, [
        '$q',
        factory
    ]);

    function factory($q) {

        return {

        }
    }

})('app', 'dataService', angular);
