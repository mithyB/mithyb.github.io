(function(moduleId, valueId, ng){
    'use strict';

    var value = [{
        url: '/',
        config: {
                controller: 'home as vm',
                templateUrl: 'views/home.html',
                resolve: {
                    img: function() { return 'images/blank.png'; },
                    title: function() { return ''; },
                    titleClass: function() { return ''; }
                }
            }
        },
        {
        url: '/programming',
        config: {
                controller: 'programming as vm',
                templateUrl: 'views/programming.html',
                resolve: {
                    img: function() { return 'images/programming.jpg'; },
                    title: function() { return 'Programming'; },
                    titleClass: function() { return 'programming'; }
                }
            }
        },
        {
            url: '/programming/:project',
            config: {
                controller: 'project as vm',
                templateUrl: 'views/project.html',
                resolve: {
                    img: function() { return 'images/programming.jpg'; },
                    title: function() { return 'Programming'; },
                    titleClass: function() { return 'programming'; }
                }
            }
        },
        {
            url: '/gaming',
            config: {
                controller: 'gaming as vm',
                templateUrl: 'views/gaming.html',
                resolve: {
                    img: function() { return 'images/gaming.jpg'; },
                    title: function() { return 'Gaming'; },
                    titleClass: function() { return 'gaming'; }
                }
            }
        },
        {
            url: '/music',
            config: {
                controller: 'music as vm',
                templateUrl: 'views/music.html',
                resolve: {
                    img: function() { return 'images/music.jpg'; },
                    title: function() { return 'Music'; },
                    titleClass: function() { return 'music'; }
                }
            }
        },
        {
            url: '/downloads',
            config: {
                controller: 'downloads as vm',
                templateUrl: 'views/downloads.html',
                resolve: {
                    img: function() { return 'images/blank.png'; },
                    title: function() { return ''; },
                    titleClass: function() { return ''; }
                }
            }
        }
    ];

    ng.module(moduleId).constant(valueId, value);

})('app', 'routes', angular)
