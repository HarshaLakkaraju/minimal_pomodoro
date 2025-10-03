let timerDisplay = document.getElementById('timer');
let timeLeft = 25 * 60; // 25 minutes
let timerInterval;

function startTimer() {
  timerInterval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDisplay.textContent = 
      String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Pomodoro Complete!");
    }
    timeLeft--;
  }, 1000);
}

startTimer();
