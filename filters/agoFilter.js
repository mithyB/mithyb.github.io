(function(moduleId, filterId, ng){
    'use strict';

    ng.module(moduleId).filter(filterId, [filter]);

    function filter() {
        return function (d) {
            if (d) {
                var date = new Date(d * 1000);
                var dateNow = new Date();

                var timeDiff = dateNow - date;
                var seconds = Math.floor(timeDiff / 1000);
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                var days = Math.floor(hours / 24);
                var months = Math.floor(monthDiff(date, dateNow));
                var years = Math.floor(new Date(dateNow - date).getFullYear() - 1970);

                var timeText;

                if (minutes < 2) {
                    timeText = 'a few seconds ago';
                } else if (hours < 2) {
                    timeText = minutes + ' minutes ago';
                } else if (days < 2) {
                    timeText = hours + ' hours ago';
                } else if (months < 2) {
                    timeText = days + ' days ago';
                } else if (years < 2) {
                    timeText = months + ' months ago';
                } else {
                    timeText = years + ' years ago';
                }

                return timeText;
            }
        }
    }

})('app', 'ago', angular);

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}
