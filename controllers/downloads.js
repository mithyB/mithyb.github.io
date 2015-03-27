(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        'dataService',
        '$rootScope',
        '$route',
        controller
    ]);

    function controller(dataService, $rootScope, $route) {
        var vm = this;

        $rootScope.$emit('page_load', $route.current.locals);

        dataService.getDownloads().then(success, failed);

        function success(result) {
            vm.downloads = result;
        }

        function failed(error) {
            console.log(error);
        }
    }

})('app', 'downloads', angular);
