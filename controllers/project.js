(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$routeParams',
        '$scope',
        '$rootScope',
        '$route',
        controller
    ]);

    function controller($routeParams, $scope, $rootScope, $route) {
        var vm = this;

        $rootScope.$emit('page_load', $route.current.locals);

        vm.projId = $routeParams.project;
        vm.projFile = 'resources/projects/' + vm.projId + '/index.html';

        if (vm.projId == 'chatsome') {
            $.getJSON(JSON_DOWNLOADS_CHATSOME).then(success, failed);
        } else if (vm.projId == 'raycasting3') {
            $.getJSON(JSON_DOWNLOADS_RAYCASTING).then(success, failed);
        }

        function success(result) {
            vm.download = result.items;
            $scope.$apply();
        }

        function failed(error) {
            console.log(error);
        }
    }

})('app', 'project', angular);
