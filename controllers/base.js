(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$scope',
        '$rootScope',
        controller
    ]);

    function controller($scope, $rootScope) {
        var vm = this;

        $rootScope.$on('page_load', function(l, param) {
            vm.pageParam = param;
        });

        vm.christmasImg = 'images/christmas.png';

        $.getJSON(JSON_TOPICS).then(success, failed);

        function success(result) {
            vm.topics = result;
            $scope.$apply();
        }

        function failed(error) {
            console.log(error);
        }
    }

})('app', 'base', angular);
