/*
    Michael Buholzer
    2014
*/

function initAudioPlayers() {
	$(".audio-player").each(function(i, el) {
		var audioPlayer = new AudioPlayer(el);
		audioPlayer.setTimeDisplay($(".audio-player-time")[i]);
		audioPlayer.setProgressBar($(".audio-player-progress-bar")[i]);
		audioPlayer.setVolumeBar($(".audio-player-volume-bar")[i]);
		audioPlayer.setPausePlayButton($(".audio-player-pauseplay-button")[i]);
		audioPlayer.setMuteButton($(".audio-player-mute-button")[i]);
		
		$($(".audio-player-pauseplay-button")[i]).on('click', function() {
			audioPlayer.pauseplay();
		});
		$($(".audio-player-stop-button")[i]).on('click', function() { 
			audioPlayer.stop();
		});
		$($(".audio-player-progress")[i]).on('click', function(e) { 
			if (!e.offsetX) {
				e.offsetX = e.pageX - e.currentTarget.offsetLeft;
			}		
			audioPlayer.skip(e.offsetX / e.currentTarget.clientWidth);
		});
		$($(".audio-player-volume")[i]).on('click', function(e) { 
			if (!e.offsetX) {
				e.offsetX = e.pageX - e.currentTarget.offsetLeft;
			}		
			audioPlayer.setVolume(e.offsetX  / e.currentTarget.clientWidth);
		});
		$($(".audio-player-mute-button")[i]).on('click', function(e) { 
			audioPlayer.toggleMute();
		});
	});
}

AudioPlayer.audioPlayers = [];

function AudioPlayer(el) {
	this.setElement(el);

    AudioPlayer.audioPlayers.push(this);
}

AudioPlayer.prototype.setElement = function(el) {
	var self = this;
	this.el = el;
	
	var source = $(this.el).data("audiosrc");
    this.audio = document.createElement("audio");
	this.audio.setAttribute("src", source);
	this.audio.setAttribute("preload", "none");
	
	this.audio.onplay = function() {
		self.pausePlayButton.classList.remove("fa-play");
		self.pausePlayButton.classList.add("fa-pause");
		self.el.style.boxShadow = '-10px 0 0 0 #0a6';
	};
	this.audio.onpause = function() {
		self.pausePlayButton.classList.remove("fa-pause");
		self.pausePlayButton.classList.add("fa-play");
		self.el.style.boxShadow = '';
	};
	this.audio.onloadedmetadata = function() {
		self.timeDisplay.innerHTML = self.getTime();
		self.setVolume(0.5);
	};
	this.audio.ontimeupdate = function() {
		self.progressBar.style.width = (this.currentTime / this.duration * 100) + '%';
		self.timeDisplay.innerHTML = self.getTime();
	};
	this.audio.onvolumechange = function() {
		self.volumeBar.style.width = (this.volume * 100) + '%';
	};
	this.audio.onended = function() {
		this.pause();
		this.currentTime = 0;
	};
	this.audio.onseeking = function() {
		console.log('seeking...');
	};
	this.audio.onerror = function() {
		console.log('error...');
	};
	this.audio.onloadstart = function() {
		console.log('loadstart...');
	};
	this.audio.onstalled = function() {
		console.log('stalled...');
	};
	this.audio.onwaiting = function() {
		console.log('waiting...');
	}
};

AudioPlayer.prototype.setTimeDisplay = function(td) {
	this.timeDisplay = td;
};
	
AudioPlayer.prototype.setProgressBar = function(pb) {
	this.progressBar = pb;
};
	
AudioPlayer.prototype.setVolumeBar = function(vb) {
	this.volumeBar = vb;
};
	
AudioPlayer.prototype.setPausePlayButton = function(ppb) {
	this.pausePlayButton = ppb;
};
	
AudioPlayer.prototype.setMuteButton = function(mb) {
	this.muteButton = mb;
};

AudioPlayer.prototype.pauseplay = function() {

	if (this.audio.paused) {
        for (var i = 0; i < AudioPlayer.audioPlayers.length; i++) {
            AudioPlayer.audioPlayers[i].stop();
        }

		return this.audio.play();
	} else {
		return this.audio.pause();
	}
};

AudioPlayer.prototype.stop = function() {
	this.audio.pause();
	this.audio.currentTime = 0;
};

AudioPlayer.prototype.skip = function(percent) {
	this.audio.currentTime = percent * this.audio.duration;
};

AudioPlayer.prototype.setVolume = function(percent) {
	this.audio.volume = percent;
};

AudioPlayer.prototype.toggleMute = function() {
	this.audio.muted = !this.audio.muted;
	
	if (this.audio.muted) {
		this.muteButton.classList.remove("fa-volume-up");
		this.muteButton.classList.add("fa-volume-off");
	} else {
		this.muteButton.classList.remove("fa-volume-off");
		this.muteButton.classList.add("fa-volume-up");
	}
};

AudioPlayer.prototype.getTime = function() {
	return doubleToTime(this.audio.currentTime) + ' / ' + doubleToTime(this.audio.duration);
};

function doubleToTime(d) {
	var seconds = pad(d % 60);
	var mins = pad((d / 60));
	
	return mins + ':' + seconds;
}

function pad(d) {
	d = Math.floor(d);
	return (d < 10 ? '0' : '') + d;
}