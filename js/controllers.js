var app = angular.module('app', []);
var indexHTML = '';

app.controller('globals', function($scope) {
	$scope.root = getRootDir() + indexHTML;
	$scope.downloads = getRootDir() + 'downloads.html';
	$scope.contact = 'mailto:michael.buholzer@zeitag.ch';
});

app.controller('[TEMPLATE]', function ($scope) {
	$scope.img = getRootDir() + 'images/blank.png';
});

app.controller('home', function ($scope) {
	$scope.img = getRootDir() + 'images/blank.png';	
	$scope.christmasImg = getRootDir() + 'images/christmas.png';
});

app.controller('programming', function ($scope) {
	$scope.img = getRootDir() + 'images/programming.jpg';
	$scope.christmasImg = getRootDir() + 'images/christmas.png';
	
	$scope.projs = [
		{'title': 'Pathfinding',
		 'desc': 'A basic tile-based pathfinding test',
		 'url': getRootDir() + 't/programming/pathfinding/' + indexHTML,
		 'category': 'js'},
		{'title': 'Ray casting',
		 'desc': '2D visibility raycast prototype',
		 'url': getRootDir() + 't/programming/raycasting/' + indexHTML,
		 'category': 'js'},
		{'title': 'Ray casting 2',
		 'desc': '2D raycast information converted into 3D output',
		 'url': getRootDir() + 't/programming/raycasting2/' + indexHTML,
		 'category': 'js'},
		{'title': 'Chatsome',
		 'desc': 'A chat program based on TCP',
		 'url': getRootDir() + 't/programming/chatsome/' + indexHTML,
		 'category': 'cs'},
		{'title': 'Tetris',
		 'desc': 'A simple Tetris game',
		 'url': getRootDir() + 't/programming/tetris/' + indexHTML,
		 'category': 'js'},
		{'title': 'WebSocket Chat',
		 'desc': 'In-browser chat through WebSockets',
		 'url': getRootDir() + 't/programming/chat/' + indexHTML,
		 'category': 'js'},
		{'title': 'Raycast engine with Sockets',
		 'desc': 'Mulitplayer raycasting game',
		 'url': getRootDir() + 't/programming/raycasting3/' + indexHTML,
		 'category': 'cs'},
		{'title': 'Reddit Rebuilt',
		 'desc': 'Web site using Angular.js and Bootstrap.css',
		 'url': 'http://mithyb.github.io/Reddit',
		 'category': 'web'}
	];
	
	$scope.links = [
		{'title': 'Squarestare.com',
		 'url': 'http://squarestare.com',
		 'displayUrl': 'squarestare.com'},
		{'title': 'A* Pathfinding algorithm',
		 'url': 'http://www.policyalmanac.org/games/aStarTutorial.htm',
		 'displayUrl': 'policyalmanac.org'},
		{'title': 'Raycast tutorial and useful links',
		 'url': 'http://www.permadi.com/tutorial/raycast/',
		 'displayUrl': 'permadi.com'}
	];
});

app.controller('music', function ($scope) {
	$scope.img = getRootDir() + 'images/music.jpg';
	$scope.christmasImg = getRootDir() + 'images/christmas.png';
	
	$scope.search = '';
		
	$.getJSON('my_music.txt', function (result) { 
		$scope.my_songs = result;
		$scope.$apply();
		initAudioPlayers();
	});
});

app.controller('downloads', function ($scope) {
	$scope.downloads_chatsome = [ {
			'title': 'Chatsome-Mega-Pack',
			'desc': 'Includes all files (Chatsome.zip)',
			'highlighted': true,
			'size': '81 KB',
			'dllink': 'https://dl.dropboxusercontent.com/u/48838856/WEB/_downloads/chatsome.zip'
			}, {
			'title': 'Chatsome client',
			'desc': 'Chatsome.exe',
			'size': '96 KB',
			'dllink': 'https://dl.dropboxusercontent.com/u/48838856/WEB/_downloads/chatsome.exe'
			}, {
			'title': 'Chatsome server',
			'desc': 'Chatsome_server_host.exe',
			'size': '23 KB',
			'dllink': 'https://dl.dropboxusercontent.com/u/48838856/WEB/_downloads/chatsome_server_host.exe'
			}, {
			'title': 'ConnectionProvider',
			'desc': 'ConnectionProvider.dll',
			'size': '36 KB',
			'dllink': 'https://dl.dropboxusercontent.com/u/48838856/WEB/_downloads/connectionprovider.dll'
			}
		];
	
	$scope.downloads_raycasting = [ {
			'title': 'Raycasting',
			'desc': 'C# raycasting application',
			'highlighted': true,
			'size': '38 KB',
			'dllink': 'https://dl.dropboxusercontent.com/u/48838856/WEB/_downloads/raycasting.zip'
			}
		];

	$scope.downloads = [
		{ 'name': 'Chatsome',
		  'items': $scope.downloads_chatsome
		},
		{ 'name': 'Raycasting',
		  'items': $scope.downloads_raycasting
		}
	];
});

app.controller('topics', function ($scope) {
	$scope.topics = [
		{'title': 'Programming',
		 'desc': 'C, C#, JavaScript, Tutorials',
		 'url': getRootDir() + 't/programming/' + indexHTML,
		 'img': getRootDir() + 'images/programming.jpg'},
		{'title': 'Gaming',
		 'desc': 'News, Reviews, Tutorials',
		 'url': getRootDir() + 't/gaming/' + indexHTML,
		 'img': getRootDir() + 'images/gaming.jpg'},
		{'title': 'Music',
		 'desc': 'Playlists, Original Soundtracks, Compositions',
		 'url': getRootDir() + 't/music/' + indexHTML,
		 'img': getRootDir() + 'images/music.jpg'}
	];
});

app.controller('gaming', function ($scope) {	
	$scope.img = getRootDir() + 'images/gaming.jpg';
	$scope.christmasImg = getRootDir() + 'images/christmas.png';
	
	$.getJSON('https://www.reddit.com/r/gamernews.json', function (result) {
		$scope.gamingNews = [];
		for (var i = 0; i < 5; i++) {
			var post = result.data.children[i];
			var date = new Date(post.data.created * 1000);
			$scope.gamingNews.push({
				'title': post.data.title,
				'desc': post.data.media ? post.data.media.oembed.description : post.data.title,
				'url': post.data.url,
				'url_desc': post.data.domain,
				'img': post.data.thumbnail,
				'date': date.toLocaleDateString()
			});
		}
		$scope.$apply();
	});
	
	
	/*$.getJSON('gamingNews.txt', function (result) {
		$scope.gamingNews = result;
		$scope.$apply();
	});*/
	
	$.getJSON('recommendations.txt', function (result) { 
		$scope.text = result.text;
		$scope.games = result.games;
		$scope.$apply();
	});
});

function getRootDir() {
	return '/';
}