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
            img: 'images/gaming.jpg',
            title: 'Gaming',
            titleClass: 'gaming'
        });

        var getGamingNews = function() {

            $.getJSON('https://www.reddit.com/r/games/new/.json').then(success, failed);

            function success (result) {
                vm.gamingNews = [];
                for (var i = 0; i < 5; i++) {
                    var post = result.data.children[i];
                    vm.gamingNews.push({
                        'title': post.data.title,
                        'desc': post.data.media ? post.data.media.oembed.description : post.data.title,
                        'url': post.data.url,
                        'url_desc': post.data.domain,
                        'img': post.data.thumbnail == '' ? 'images/gaming.jpg' : post.data.thumbnail,
                        'date': post.data.created_utc
                    });
                }
                $scope.$apply();
            }

            function failed (error) {
                console.log(error);
            }
        };

        var getGameRecommendations = function() {

            $.getJSON(JSON_RECOMMENDATIONS).then(success, failed);

            function success(result) {
                vm.text = result.text;
                vm.games = result.games;
                $scope.$apply();
            }

            function failed(error) {
                console.log(error);
            }
        };

        getGameRecommendations();
        getGamingNews();
    }

})('app', 'gaming', angular);
