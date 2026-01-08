const audio = document.getElementById("myAudio");
const video = document.getElementById("myVideo");
const audioTimeSpan = document.getElementById("audioTime");
const videoTimeSpan = document.getElementById("videoTime");

// Format seconds as M:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const paddedSecs = secs < 10 ? "0" + secs : secs;
  return mins + ":" + paddedSecs;
}

// Update audio time
audio.addEventListener("timeupdate", () => {
  audioTimeSpan.textContent = formatTime(audio.currentTime);
});

// Update video time
video.addEventListener("timeupdate", () => {
  videoTimeSpan.textContent = formatTime(video.currentTime);
});
