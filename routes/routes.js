(function(moduleId, valueId, ng){
    'use strict';

    var value = [{
        url: '/',
        config: {
                controller: 'home as vm',
                templateUrl: 'views/home.html'
            }
        },
        {
        url: '/programming',
        config: {
                controller: 'programming as vm',
                templateUrl: 'views/programming.html'
            }
        },
        {
            url: '/programming/:project',
            config: {
                controller: 'project as vm',
                templateUrl: 'views/project.html'
            }
        },
        {
            url: '/gaming',
            config: {
                controller: 'gaming as vm',
                templateUrl: 'views/gaming.html'
            }
        },
        {
            url: '/music',
            config: {
                controller: 'music as vm',
                templateUrl: 'views/music.html'
            }
        },
        {
            url: '/downloads',
            config: {
                controller: 'downloads as vm',
                templateUrl: 'views/downloads.html'
            }
        }
    ];

    ng.module(moduleId).constant(valueId, value);

})('app', 'routes', angular)
