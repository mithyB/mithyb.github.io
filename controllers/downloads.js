(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        'dataService',
        controller
    ]);

    function controller(dataService) {
        var vm = this;

        dataService.getDownloads().then(success, failed);

        function success(result) {
            vm.downloads = result;
        }

        function failed(error) {
            console.log(error);
        }
    }

})('app', 'downloads', angular);
