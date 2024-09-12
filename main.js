//** Selectors */
const seekBar = document.getElementById("seekbar");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const playPauseBtn = document.getElementById("play-pause-btn");
const repeatBtn = document.getElementById("repeat-btn");
const currentTimeDisplay = document.getElementById("current-time-display");
const fullDurationDisplay = document.getElementById("full-duration-display");
const videoNameDisplay = document.querySelector(".video-name");
const subtitlesBtn = document.getElementById("subtitles");
const volumeBtn = document.getElementById("volume-icon");
const volumeInputRange = document.getElementById("volume");
const playSpeedBtn = document.getElementById("playback-speed");
const fullScreenBtn = document.getElementById("fullscreen");
const playlistListItems = document.querySelectorAll(".playlist-item");
const video = document.getElementById("video");
const videoSubtitle = document.getElementById("video_sub");
const videoContainer = document.querySelector(".video_container");
const playlistItems = document.querySelectorAll(".playlist-item");

/**
 ** ** ** ** ** LOAD EVENT ** ** ** ** **
 ** ** ** ** ** LOAD EVENT ** ** ** ** **
 ** ** ** ** ** LOAD EVENT ** ** ** ** **
 */

window.addEventListener("load", () => {
    // Initiate Volume level
    video.volume = 0.5;
    // Display Video Title Logic
    videoNameDisplay.innerText = video.title || "No title was provided";
    // Display Duration Logic
    fullDurationDisplay.innerText = formatTime(video.duration);
});
video.onloadedmetadata = function () {
    this.volume = 0.5;
    // videoNameDisplay.innerText = this.title || "No title was provided";
    fullDurationDisplay.innerText = formatTime(this.duration);
};
//** Play Pause Logic */
let isFullScreen = false;
video.addEventListener("click", playPauseVideo);
video.addEventListener("fullscreenchange", () => {
    isFullScreen = !isFullScreen;
});
playPauseBtn.addEventListener("click", playPauseVideo);
function playPauseVideo() {
    // Check if the video is fullscreen, if not then execute the following code
    if (!isFullScreen) {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    } else {
        return;
    }
}
video.addEventListener("play", () => {
    toggleClass(playPauseBtn.children[0], "fa-play", "fa-pause");
});
video.addEventListener("pause", () => {
    toggleClass(playPauseBtn.children[0], "fa-pause", "fa-play");
});
video.addEventListener("fullscreenchange", () => {});
//** FullScreen Logic (DBLClick + BtnClick) */
function videoFullscreen() {
    video.requestFullscreen();
}
video.addEventListener("dblclick", videoFullscreen);
fullScreenBtn.addEventListener("click", videoFullscreen);

//* Seek bar Logic
seekBar.addEventListener("input", (e) => {
    // video.currentTime = (e.target.value * video.duration) / 100;
    video.currentTime = e.target.value;
});

//* Looping Logic
repeatBtn.addEventListener("click", () => {
    repeatBtn.classList.toggle("repeating");
    if (video.loop) {
        video.loop = false;
    } else {
        video.loop = true;
    }
});

//* Volume Adjustment & Mute Logic

// Mute Logic
volumeBtn.addEventListener("click", () => {
    if (video.muted) {
        video.muted = false;
        volumeInputRange.value = video.volume;
        video.volume = 0.5;
        toggleClass(volumeBtn.children[0], "fa-volume-xmark", "fa-volume-low");
    } else {
        video.muted = true;
        volumeInputRange.value = 0;
        toggleClass(volumeBtn.children[0], "fa-volume-high", "fa-volume-xmark");
    }
});
// Volume Logic
volumeInputRange.addEventListener("change", (e) => {
    if (video.muted) video.muted = false;
    const volumeLevel = Number(e.target.value);
    video.volume = volumeLevel;
    // Case Mute
    if (volumeLevel === 0) {
        volumeBtn.children[0].classList = "fa-solid fa-volume-xmark";
    }
    // Case Off
    else if (volumeLevel > 0 && volumeLevel < 0.3) {
        volumeBtn.children[0].classList = "fa-solid fa-volume-off";
    }
    // Case Low
    else if (volumeLevel > 0.3 && volumeLevel < 0.6) {
        volumeBtn.children[0].classList = "fa-solid fa-volume-low";
    }
    // Case High
    else if (volumeLevel > 0.6 && volumeLevel <= 1) {
        volumeBtn.children[0].classList = "fa-solid fa-volume-high";
    }
});

// Display Current Time Logic
video.addEventListener("timeupdate", () => {
    currentTimeDisplay.innerText = formatTime(video.currentTime);
    seekBar.value = video.currentTime;
    seekBar.max = video.duration;
});

// Display Play back speed logic
let clickCount = 0;
playSpeedBtn.addEventListener("click", function () {
    clickCount++;
    switch (clickCount) {
        case 1:
            video.playbackRate = 1.5;
            playSpeedBtn.children[0].title = 1.5;
            break;
        case 2:
            video.playbackRate = 2;
            playSpeedBtn.children[0].title = 2;
            break;
        case 3:
            video.playbackRate = 0.5;
            playSpeedBtn.children[0].title = 0.5;
            break;
        case 4:
            video.playbackRate = 1;
            playSpeedBtn.children[0].title = 1;
            clickCount = 0;
            break;
        default:
            break;
    }
    displayPlayRateCount(video.playbackRate);
    console.log(`Current playback rate: ${video.playbackRate}`);
});
function displayPlayRateCount(playbackRate) {
    const span = document.createElement("span");
    span.classList = "playRateDisplay";
    span.innerText = `x ${playbackRate}`;

    if (document.querySelector(".playRateDisplay")) {
        document.querySelector(".playRateDisplay").remove();
        videoContainer.append(span);
    } else {
        videoContainer.append(span);
    }
}

// Subtitles Logic
subtitlesBtn.addEventListener("click", () => {
    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].mode === "showing") {
            tracks[i].mode = "disabled";
            toggleClass(subtitlesBtn.children[0], "fa-solid", "fa-regular");
            subtitlesBtn.title = "show subtitles";
        } else {
            tracks[i].mode = "showing";
            toggleClass(subtitlesBtn.children[0], "fa-regular", "fa-solid");
            subtitlesBtn.title = "subtitles showing";
        }
    }
});

// *****************************************
// ********** Changing The  Video **********
// *****************************************

// Change Video via selecting a list item
playlistItems.forEach((item) => {
    let videoName = item.attributes["data-src"].value
        .replace(/^\.\//, "")
        .split(".")
        .slice(0, -1)
        .join(".");
    item.textContent = videoName;
    item.addEventListener("click", () => {
        playlistItems.forEach((otherItem) => {
            otherItem.classList.remove("item-selected");
        });
        item.classList.add("item-selected");
        video.src = item.attributes["data-src"].value;
        videoSubtitle.src = item.attributes["data-sub"]?.value || "";
        videoNameDisplay.innerText = videoName;
        playPauseBtn.children[0].classList = "fa-solid fa-play";
    });
});

// Change Video via previous/next buttons
let currentVideoIndex = Array.from(playlistItems).findIndex(
    (item) => item.getAttribute("data-src") === video.src
);

function navigatePlaylist(direction) {
    playlistItems.forEach((item) => item.classList.remove("item-selected"));

    if (direction === "next") {
        currentVideoIndex = (currentVideoIndex + 1) % playlistItems.length;
    } else if (direction === "prev") {
        currentVideoIndex =
            (currentVideoIndex - 1 + playlistItems.length) %
            playlistItems.length;
    }

    video.src = playlistItems[currentVideoIndex].getAttribute("data-src");
    let subtitleSrc =
        playlistItems[currentVideoIndex].getAttribute("data-sub") || "";
    videoSubtitle.src = subtitleSrc;
    video.textTracks[0].mode = subtitleSrc ? "showing" : "hidden";

    playlistItems[currentVideoIndex].classList.add("item-selected");

    let videoSrc = video.src;
    let decodedVideoName = decodeURIComponent(
        videoSrc.substring(videoSrc.lastIndexOf("/") + 1)
    );
    let videoName = decodedVideoName.split(".").slice(0, -1).join(".");
    videoNameDisplay.innerText = videoName;

    playPauseBtn.children[0].classList = "fa-solid fa-play";
}

nextBtn.addEventListener("click", () => navigatePlaylist("next"));
prevBtn.addEventListener("click", () => navigatePlaylist("prev"));

//? ================================
//? ======= Helper Functions =======
//? ================================
function toggleClass(element, classToRemove, classToAdd) {
    element.classList.remove(classToRemove);
    element.classList.add(classToAdd);
}
// Display Duration Helper Function
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainderSeconds = Math.floor(seconds % 60);
    let formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    let formattedSeconds =
        remainderSeconds < 10 ? `0${remainderSeconds}` : `${remainderSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
}
