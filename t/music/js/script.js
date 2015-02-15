function play(e, forcePlay) {
	var ctx = e.currentTarget.parentNode;
	var audio = ctx.getElementsByTagName('audio')[0];
	audio.ontimeupdate = function(e) {
		ctx.getElementsByTagName('span')[2].innerHTML = doubleToTime(audio.currentTime);
		ctx.getElementsByTagName('span')[3].innerHTML = doubleToTime(audio.duration);
		ctx.getElementsByTagName('span')[5].style.width = audio.currentTime/audio.duration*100 + '%';
	};
	
	var img = ctx.getElementsByTagName('img')[0];
	audio.onended = function() {
		audio.currentTime = 0;
		img.style.boxShadow = '';
	}
	if (audio.paused || forcePlay) {
		audio.play();
		img.style.boxShadow = '-5px 0 0 0 #fa4';
	} else {
		audio.pause();
		img.style.boxShadow = '';
	}
}

function skip(e) {
	var ctx = e.currentTarget;
	var audio = ctx.getElementsByTagName('audio')[0];
	
	var progress = (e.clientX - ctx.offsetLeft) / e.currentTarget.clientWidth;
	audio.currentTime = audio.duration * progress;
	
	play(e, true);
}

function doubleToTime(d) {
	var seconds = pad(d % 60);
	var mins = pad((d / 60));
	
	return mins + ':' + seconds;
}

function pad(d) {
	d = Math.floor(d);
	return (d < 10 ? '0' : '') + d;
}