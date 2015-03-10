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
            vm.img = param.img;
            vm.title = param.title;
            vm.titleClass = param.titleClass;
        });

        vm.img = 'images/blank.png';
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
