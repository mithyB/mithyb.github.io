(function (moduleId, factoryId, ng) {
    'use strict';

    ng.module(moduleId).factory(factoryId, [
        '$q',
        factory
    ]);

    function factory($q) {

        return {
            getDownloads: getDownloads
        };

        function getDownloads() {
            var deferred = $q.defer();

            var downloads = [];

            $.getJSON(JSON_DOWNLOADS_CHATSOME).then(function(result) {
                downloads.push(result);

                $.getJSON(JSON_DOWNLOADS_RAYCASTING).then(success, failed);

            }, failed);

            function success(result) {
                downloads.push(result);

                deferred.resolve(downloads);
            }

            function failed(error) {
                deferred.reject(error);
            }

            return deferred.promise;
        }
    }

})('app', 'dataService', angular);
