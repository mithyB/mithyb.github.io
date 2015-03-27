(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$scope',
        '$rootScope',
        '$route',
        controller
    ]);

    function controller($scope, $rootScope, $route) {
        var vm = this;

        $rootScope.$emit('page_load', $route.current.locals);

        var getProjects = function() {

            $.getJSON(JSON_PROJECTS).then(success, failed);

            function success(result) {
                vm.projs = result;
                $scope.$apply();
            }

            function failed(error) {
                console.log(error);
            }
        };

        var getLinks = function() {

            $.getJSON(JSON_LINKS).then(success, failed);

            function success(result) {
                vm.links = result;
                $scope.$apply();
            }

            function failed(error) {
                console.log(error);
            }
        };

        getProjects();
        getLinks();
    }

})('app', 'programming', angular);
