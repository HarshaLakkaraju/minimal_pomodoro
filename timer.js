const { ipcRenderer } = require("electron");

// DOM elements
const timerDisplay = document.getElementById("timer");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");
const timeInput = document.getElementById("timeInput");
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const leftPlayPauseBtn = document.getElementById("leftPlayPause");

// Timer variables
let timeLeft = 45 * 60;
let timer = null;
let running = false;

// Preset durations
const presets = [25, 45, 60, 90];
let currentPresetIndex = 1;

// Audio
let alarmSound = null;
let alarmTimeout = null;

// Update notification
let updateNotification = null;

// Load alarm sound
function loadAlarmSound() {
  try {
    alarmSound = new Audio('sounds/alarm.mp3');
    alarmSound.volume = 0.7;
  } catch (error) {
    console.log('Using fallback beep');
  }
}

function playAlarm() {
  try {
    if (alarmSound) {
      alarmSound.currentTime = 0;
      alarmSound.play();
      alarmTimeout = setTimeout(stopAlarm, 5000);
    } else {
      fallbackBeep();
    }
  } catch (error) {
    fallbackBeep();
  }
}

function stopAlarm() {
  if (alarmSound) {
    alarmSound.pause();
  }
  if (alarmTimeout) {
    clearTimeout(alarmTimeout);
  }
}

function fallbackBeep() {
  console.log('Beep! Timer finished!');
}

function updateDisplay() {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  timerDisplay.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function updatePlayPauseButtons() {
  const icon = running ? "⏸" : "▶";
  startPauseBtn.textContent = running ? "Pause" : "Start";
  leftPlayPauseBtn.textContent = icon;
}

function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateDisplay();
  } else {
    clearInterval(timer);
    running = false;
    updatePlayPauseButtons();
    playAlarm();
  }
}

function togglePlayPause() {
  if (!running) {
    if (timeLeft <= 0) timeLeft = parseInt(timeInput.value) * 60;
    timer = setInterval(tick, 1000);
    running = true;
  } else {
    clearInterval(timer);
    running = false;
  }
  updatePlayPauseButtons();
}

function resetTimer() {
  clearInterval(timer);
  running = false;
  timeLeft = parseInt(timeInput.value) * 60;
  updateDisplay();
  updatePlayPauseButtons();
  stopAlarm();
}

function toggleMenu() {
  menu.classList.toggle("hidden");
}

function cyclePreset() {
  currentPresetIndex = (currentPresetIndex + 1) % presets.length;
  const newPreset = presets[currentPresetIndex];
  timeInput.value = newPreset;
  timeLeft = newPreset * 60;
  updateDisplay();
  
  timerDisplay.style.color = '#ffff99';
  setTimeout(() => {
    timerDisplay.style.color = '#00ff99';
  }, 300);
}

// Update notifications
function showUpdateNotification(message, showAction = false) {
  if (updateNotification) {
    updateNotification.remove();
  }

  updateNotification = document.createElement('div');
  updateNotification.style.cssText = `
    position: fixed;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.95);
    color: #00ff99;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 11px;
    z-index: 10000;
    border: 1px solid #00ff99;
    max-width: 180px;
    text-align: center;
  `;

  updateNotification.textContent = message;

  if (showAction) {
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.style.cssText = `
      margin-top: 5px;
      background: #00ff99;
      color: #000;
      border: none;
      border-radius: 4px;
      padding: 3px 8px;
      cursor: pointer;
      font-size: 10px;
    `;
    restartButton.onclick = () => {
      ipcRenderer.invoke('restart-and-update');
    };
    updateNotification.appendChild(restartButton);
  }

  document.body.appendChild(updateNotification);

  if (!showAction) {
    setTimeout(() => {
      if (updateNotification && updateNotification.parentNode) {
        updateNotification.parentNode.removeChild(updateNotification);
      }
    }, 5000);
  }
}

// Update event handlers
ipcRenderer.on('update-available', () => {
  showUpdateNotification('📥 Update available. Downloading...');
});

ipcRenderer.on('update-downloaded', () => {
  showUpdateNotification('✅ Update downloaded! Restart to install.', true);
});

// Event listeners
startPauseBtn.onclick = togglePlayPause;
resetBtn.onclick = resetTimer;
leftPlayPauseBtn.onclick = togglePlayPause;
menuBtn.onclick = toggleMenu;

timeInput.onchange = () => {
  timeLeft = parseInt(timeInput.value) * 60;
  updateDisplay();
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.target === timeInput) return;
  
  switch(e.code) {
    case 'Space':
      e.preventDefault();
      togglePlayPause();
      break;
    case 'KeyR':
      e.preventDefault();
      resetTimer();
      break;
    case 'KeyM':
      e.preventDefault();
      toggleMenu();
      break;
    case 'KeyC':
      e.preventDefault();
      cyclePreset();
      break;
    case 'KeyS':
      e.preventDefault();
      stopAlarm();
      break;
    case 'KeyU':
      e.preventDefault();
      ipcRenderer.invoke('get-app-version').then(version => {
        showUpdateNotification(`Current version: v${version}`);
      });
      break;
  }
});

// Initialize
updateDisplay();
updatePlayPauseButtons();
loadAlarmSound();