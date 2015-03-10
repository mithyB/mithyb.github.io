(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$scope',
        '$rootScope',
        controller
    ]);

    function controller($scope, $rootScope) {
        var vm = this;

        $rootScope.$emit('page_load', {
            img: 'images/blank.png',
            title: '',
            titleClass: ''
        });

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
