var app = angular.module('app', []);

app.controller('scoreboard', function($scope) {	
	$.getJSON('scoreboard.txt', function (arr) {
		lowestTopScore = 0;
		if (arr.length > 0) {
			lowestTopScore = arr[arr.length - 1].score;
		}
		
		topScoreCount = arr.length;
		
		$scope.entries = arr;
		$scope.$apply();
	});
});