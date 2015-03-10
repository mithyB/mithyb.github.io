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

        $rootScope.$emit('page_load', {
            img: 'images/music.jpg',
            title: 'Music',
            titleClass: 'music'
        });

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
                setTimeout(initAudioPlayers, 100);
            }

            function failed(error) {
                console.log(error);
            }
        };

        getMusic();
    }

})('app', 'music', angular);
