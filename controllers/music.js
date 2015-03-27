(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$location',
        '$route',
        '$scope',
        '$rootScope',
        controller
    ]);

    function controller($location, $route, $scope, $rootScope) {
        var vm = this;

        $rootScope.$emit('page_load', $route.current.locals);

        vm.onKeyPress = function(e) {
            if (e.keyCode == 13) {
                $location.search('s', vm.search)
                $route.reload();
            }
        };

        var search = $location.search().s;
        vm.search = search ? search : '';

        var getMusic = function() {

            $.getJSON(JSON_MYMUSIC).then(success, failed);

            function success (result) {
                vm.my_songs = result;
                $scope.$apply();
            }

            function failed(error) {
                console.log(error);
            }
        };

        getMusic();
    }

})('app', 'music', angular);
