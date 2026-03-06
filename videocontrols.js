var video = document.getElementById("video");

video.oncanplaythrough = function() {
    video.muted = false;
    video.play();
}

// controls
let playPauseElement = document.getElementById('playPause')
function playPause() {
    if (video.paused) {
        video.play()
    } else {
        video.pause()
    }
}

function forward() {
    video.currentTime += 5
}

function backward() {
    video.currentTime -= 5
}

// controls opacity
let videoHolder = document.getElementById('videoHolder')
let wait

function hideControls() {
    if (!dragClicked) {
        videoHolder.style.setProperty('--controlsOpacity', 0)
    }
}

function hideTimer() {
    wait = setTimeout(() => {
        hideControls()
    }, 2500);
}

async function showControls() {
    videoHolder.style.setProperty('--controlsOpacity', 0.75);
    clearTimeout(wait);
    hideTimer()
}

videoHolder.addEventListener('mousemove', showControls)
videoHolder.addEventListener('click', showControls)
videoHolder.addEventListener('mouseleave', hideControls)

window.addEventListener('keydown', (e) => {
    showControls()
    if (e.code == 'ArrowRight') {
        forward()
    } else if (e.code == 'ArrowLeft') {
        backward()
    } else if (e.code == 'Space') {
        e.preventDefault()
        playPause()
    }
})

// timeline
let timelineLoop
let timeline = document.getElementById('timeline')
let timelineDrag = document.getElementById('timelineDrag')
let videoPercent = 0
async function updateTimeline() {
    videoPercent = (video.currentTime/video.duration) * 100
    if (videoPercent <= 100) {
        timeline.style.setProperty('--videoPercent', `${videoPercent}` + '%')
        timelineDrag.style.setProperty('left', `${videoPercent}` + '%')
    }
}

video.addEventListener('timeupdate', () => {
    updateTimeline()
    if (dragClicked) {
        video.pause()
    }
})

// timeline dragger
let dragClicked = false
let mouseX
timelineDrag.addEventListener('mousedown', () => {
    dragClicked = true
})

window.addEventListener('mouseup', () => {
    dragClicked = false
})

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    if (dragClicked) {
        drag()
    }
})

async function drag() {
    bounds = video.getBoundingClientRect()
    adjustedX = Math.max(0, Math.min(mouseX - bounds.left, bounds.width))
    video.currentTime = video.duration * (adjustedX/bounds.width)
    updateTimeline()
}

video.addEventListener('playing', () => {
    playPauseElement.src = "https://www.svgrepo.com/show/390017/media-player-ui-button-pause.svg"
})
video.addEventListener('pause', () => {
    playPauseElement.src = "https://www.svgrepo.com/show/390019/media-player-ui-button-play.svg"
})