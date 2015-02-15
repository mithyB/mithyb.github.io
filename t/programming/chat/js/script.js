var socket;
var chatLog;
var connectionString = 'ws://d-025.zeitag.local:8080/';
var username;

function readPageParameter() {
    var query = window.location.search.substring(1);
    var paramsList = query.split('&');

    for (var i = 0; i < paramsList.length; i++) {
        var param = paramsList[i].split('=');
        if (param[0] == 'cs') {
            connectionString = 'ws://' + param[1] + ':8080/';
        }
    }
}

window.addEventListener('load', function() {
	var head = document.getElementsByTagName('head')[0];
	
	if (window.location.hash == '#cmd') {
		head.innerHTML += '<link rel="stylesheet" type="text/css" href="css/style_cmd.css">';
	} else if (window.location.hash == '#ms') {
		head.innerHTML += '<link rel="stylesheet" type="text/css" href="css/style_ms.css">';	
	} else if (window.location.hash == '#nocss') {
		// no css
	} else {
		head.innerHTML += '<link rel="stylesheet" type="text/css" href="css/style.css">';
	}
	
	readPageParameter();	

	document.getElementById('chatView').style.visibility = 'collapse';
	
	var userInput = document.getElementById('userInput');
	var msgInput = document.getElementById('msgInput');
	userInput.oninput = userInput.onpaste = userInput.onkeydown = 
	msgInput.oninput = msgInput.onpaste = msgInput.onkeydown = onChange;
	
	chatLog = document.getElementById('chatLog');
}, false);

function onChange(evt) {
	if (evt.currentTarget.id == 'userInput') {
		var input = document.getElementById('userInput');
		if (input.value.length < 1 || input.value.length > 12) {
			document.getElementById('loginButton').disabled = true;
		} else {
			document.getElementById('loginButton').disabled = false;
		}
		
	} else if (evt.currentTarget.id == 'msgInput') {
		var input = document.getElementById('msgInput');
		if (input.value.length < 1 || input.value.length > 1024) {
			document.getElementById('sendButton').disabled = true;
		}
		else {
			document.getElementById('sendButton').disabled = false;
		}
	}
}

function onKeyDown(code, evt, button) {
	if (evt.keyCode == code) {	
        document.getElementById(button).click();
	}
}

function addMessage(msg) {
	chatLog.innerHTML += '<p class="line"><span class="timestamp">' + getTimestamp() + '</span> ' + msg + '</p>';
	
	var element = document.getElementById('chatLogContainer');
	element.scrollTop = element.scrollHeight;
}

function getTimestamp() {
	var d = new Date();
	return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}

function pad(n) {
    return (n < 10) ? ('0' + n) : n;
}

function connect() {
	username = document.getElementById('userInput').value;	
	document.getElementById('loginView').style.visibility = 'collapse';
	document.getElementById('chatView').style.visibility = 'visible';
	document.getElementById('msgInput').focus();
	
	socket = new WebSocket(connectionString);
	
	socket.onopen = function (evt) {
		addMessage('<em>** Connected</em> as ' + username);
		socket.send('CONNECT;' + username);
	}
	socket.onmessage = function (evt) {
		addMessage(evt.data);
	}
	socket.onclose = function (evt) {
		addMessage('<em>** Connection lost</em>');
	}
}

function send() {
	var msg = document.getElementById('msgInput').value;
	
	if (msg.length < 1 || msg.length > 1024) {
		return;
	}	
	
	document.getElementById('msgInput').value = '';
	
	if (msg[0] == '/') {
		socket.send('COMMAND;' + msg);
	} else {
		socket.send('<em>' + username + '</em>: ' + msg);
	}
	
	document.getElementById('sendButton').disabled = true;
}

window.addEventListener('beforeunload', function() {
	if (socket) {
		socket.send('DISCONNECT');
		socket.close();
	}
}, false);