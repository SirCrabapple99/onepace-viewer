var video = document.getElementById("video")

video.oncanplaythrough = function () {
    video.muted = false
    video.play()
}

// controls
let playPauseElement = document.getElementById('playPause')

function playPause() {
    if (video.paused) {
        wasPaused = false
        video.play()
    } else {
        wasPaused = true
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
    if (!dragClicked && !controlsLocked) {
        videoHolder.style.setProperty('--controlsOpacity', 0)
    }
}

function hideTimer() {
    wait = setTimeout(() => {
        hideControls()
    }, 2500)
}

async function showControls() {
    videoHolder.style.setProperty('--controlsOpacity', 1)
    clearTimeout(wait)
    hideTimer()
}

videoHolder.addEventListener('mousemove', showControls)
videoHolder.addEventListener('click', showControls)
videoHolder.addEventListener('mouseleave', hideControls)


// video controls and also show controls on keypress
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
    videoPercent = (video.currentTime / video.duration) * 100
    if (videoPercent <= 100) {
        timeline.style.setProperty('--videoPercent', `${videoPercent}` + '%')
        timelineDrag.style.setProperty('left', `${videoPercent}` + '%')
    }
}

video.addEventListener('timeupdate', () => {
    updateTimeline()
})

// timeline dragger
let dragClicked = false
let mouseX
timelineDrag.addEventListener('mousedown', () => {
    dragClicked = true
})
timelineDrag.addEventListener('touchstart', () => {
    dragClicked = true
})

window.addEventListener('mouseup', () => {
    dragClicked = false
})
window.addEventListener('touchend', () => {
    dragClicked = false
})

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    if (dragClicked) {
        drag()
    }
})
window.addEventListener('touchmove', (e) => {
    mouseX = e.touches[0].clientX
    if (dragClicked) {
        drag()
    }
})


async function drag() {
    bounds = video.getBoundingClientRect()
    adjustedX = Math.max(0, Math.min(mouseX - bounds.left, bounds.width))
    video.currentTime = video.duration * (adjustedX / bounds.width)
    updateTimeline()
}


// keep video paused on currentTime change & change the playpause image
let wasPaused = false
video.addEventListener('playing', () => {
    controlsLocked = false
    if (wasPaused == true) {
        video.pause()
    } else {
        playPauseElement.setAttribute('src', './Assets/pause-solid-full.svg')
    }
})

video.addEventListener('pause', () => {
    playPauseElement.setAttribute('src', './Assets/play-solid-full.svg')
    wasPaused = true
})

// make controls show onload since it can't autoplay
let controlsLocked = true
window.onload = () => {
    showControls()
}

// fullscreen stuff
function fullScreenToggle() {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        videoHolder.requestFullscreen()
    }
}

let expandCompress = document.getElementById('expandCompress')
function fullScreenCheck() {
    if (document.fullscreenElement) {
        expandCompress.setAttribute('src', './Assets/compress-solid-full.svg')
    } else {
        expandCompress.setAttribute('src', './Assets/expand-solid-full.svg')
    }
}

window.addEventListener('fullscreenchange', fullScreenCheck)