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

        $.getJSON(JSON_TOPICS).then(success, failed);

        function success(result) {
            vm.topics = result;
            $scope.$apply();
        }

        function failed(error) {
            console.log(error);
        }
    }

})('app', 'home', angular);
