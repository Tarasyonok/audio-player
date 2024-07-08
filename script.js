// Info
let background = document.querySelector('.background');
let preview = document.querySelector('.preview');
let singer = document.querySelector('.singer');
let title = document.querySelector('.title');

// Buttons
let playBtn = document.querySelector('.play-btn');
let prevBtn = document.querySelector('.prev');
let nextBtn = document.querySelector('.next');

// Volume
let volumeImg = document.querySelector('.volume-indicator');
let volumeRange = document.querySelector('.volume');
let currVolume = 50;

// Time
let songTime = document.querySelector('.song-time');
let timeLine = document.querySelector('.time-line');
let currTime = document.querySelector('.curr-time');

// Data
let SONGS = [
    {
        singer: 'Beyonce',
        title: "Don't Hurt Yourself",
        image: 'images/image1.jpg',
        audio: 'audio/beyonce.mp3',
    },
    {
        singer: 'Dua Lipa',
        title: "Don't Start Now",
        image: 'images/image2.jpg',
        audio: 'audio/dontstartnow.mp3',
    },
    {
        singer: 'Dyalla',
        title: 'Autumn Wind',
        image: 'images/image3.jpg',
        audio: 'audio/autumnwind.mp3',
    },
];

// audio variables
let songIndex = 0;
audio = new Audio();
let timerId;
let onPause = true;

// change song function
function playSong() {
    let song = SONGS[songIndex];
    background.src = song.image;
    preview.src = song.image;
    singer.innerHTML = song.singer;
    title.innerHTML = song.title;
    audio.src = song.audio;
    // when the song in loaded start to move the poiner
    audio.onloadedmetadata = () => {
        // set the max range value to audio duration
        timeLine.max = audio.duration;
        songTime.innerHTML = `${Math.floor(audio.duration / 60)}:${Math.round(audio.duration % 60).toString().padStart(2, '0')}`;
        // set value to 0
        timeLine.value = 0;
        currTime.innerHTML = '0:00'

        // ckick to stop pointer move when mousedown timeLine
        let click = false;

        // clear interval because old interval will change pointer even if we don't need it
        clearInterval(timerId);
        // set new interval that change pointer every half a second
        timerId = setInterval(() => {
            if (!click) {
                timeLine.value = audio.currentTime;
            }
            currTime.innerHTML = `${Math.floor(audio.currentTime / 60)}:${Math.round(audio.currentTime % 60).toString().padStart(2, '0')}`;
            if (audio.currentTime === audio.duration) {
                songIndex = (songIndex + 1) % SONGS.length;
                playSong();
                start()
            }
        }, 500);

        // add onchange on timeLine to change audio current time
        timeLine.onchange = () => {
            console.log(timeLine.value)
            if (Math.abs(audio.currentTime - timeLine.value) > 5) {
                audio.currentTime = timeLine.value;
                currTime.innerHTML = `${Math.floor(audio.currentTime / 60)}:${Math.round(audio.currentTime % 60).toString().padStart(2, '0')}`;
            }
        }

        // just check if the mouse is down or not
        timeLine.onmousedown = () => {
            click = true;
            audio.pause();
        }

        timeLine.onmouseup = () => {
            click = false;
            if (!onPause) {
                audio.play();
            }
        }

        timeLine.onmousemove = () => {
            if (click) {
                audio.currentTime = timeLine.value;
                currTime.innerHTML = `${Math.floor(audio.currentTime / 60)}:${Math.round(audio.currentTime % 60).toString().padStart(2, '0')}`;
            }
        }

    }
}

// load first song when user reload the page
playSong();

// next and previous songs buttons
prevBtn.addEventListener('click', () => {
    songIndex = (songIndex - 1) >= 0 ? (songIndex - 1) : SONGS.length - 1;
    playSong();
    start()
});

nextBtn.addEventListener('click', () => {
    songIndex = (songIndex + 1) % SONGS.length;
    playSong();
    start()
});

// play/pause button
playBtn.addEventListener('click', () => {
    if (onPause) {
        start()
    } else {
        stop()
    }
});

// start playing and stop playing
function start() {
    onPause = false;
    playBtn.src = 'images/pause.png';
    preview.style.transform = 'scale(1.1)';
    audio.play();
}

function stop() {
    onPause = true;
    playBtn.src = 'images/play.png';
    preview.style.transform = 'scale(1)';
    audio.pause();
}

audio.volume = currVolume / 400;
let volumeClick = false;

// to get 10 points for improvement player: change volume with a range
volumeRange.addEventListener('change', () => {
    changeVolume();
});

// just like with time line
volumeRange.onmousedown = () => {
    volumeClick = true;
}

volumeRange.onmouseup = () => {
    volumeClick = false;
}

volumeRange.onmousemove = () => {
    if (volumeClick) {
        changeVolume();
    }
}

// make a function not to repeat the code
function changeVolume() {
    // I made conditionals to make my own volume change
    if (volumeRange.value < 50) {
        audio.volume = volumeRange.value / 500;
    } else if (volumeRange.value < 75) {
        audio.volume = volumeRange.value / 300;
    } else {
        audio.volume = volumeRange.value / 200;
    }

    // change volume icon
    if (volumeRange.value == 0) {
        volumeImg.src = 'images/mute.png';
    } else if (volumeRange.value <= 30) {
        volumeImg.src = 'images/quiet.png';
    } else if (volumeRange.value <= 70) {
        volumeImg.src = 'images/medium.png';
    } else {
        volumeImg.src = 'images/loud.png';
    }
}

// let user mute sound by clicking volume icon
volumeImg.addEventListener('click', () => {
    if (volumeImg.src.endsWith('images/mute.png')) {
        volumeRange.value = currVolume;
    } else {
        currVolume = volumeRange.value;
        volumeRange.value = 0;
    }
    changeVolume();
});