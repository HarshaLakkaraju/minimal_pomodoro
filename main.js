const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let autoUpdater;
try {
  autoUpdater = require("electron-updater").autoUpdater;
} catch (error) {
  console.log('Auto-updater not available:', error.message);
  autoUpdater = null;
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 200,
    height: 120,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    icon: path.join(__dirname, 'assets/icon.ico')
  });

  mainWindow.loadFile("index.html");

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Check for updates if available
    if (autoUpdater) {
      setTimeout(() => {
        checkForUpdates();
      }, 2000);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function checkForUpdates() {
  if (!autoUpdater || process.env.NODE_ENV === 'development') {
    return;
  }
  
  try {
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('update-available', () => {
      if (mainWindow) {
        mainWindow.webContents.send('update-available');
      }
    });

    autoUpdater.on('update-downloaded', () => {
      if (mainWindow) {
        mainWindow.webContents.send('update-downloaded');
      }
    });

    autoUpdater.on('error', (err) => {
      console.error('Auto-updater error:', err);
    });

    autoUpdater.checkForUpdatesAndNotify();
  } catch (error) {
    console.error('Failed to check for updates:', error);
  }
}

// IPC handlers
ipcMain.handle('restart-and-update', () => {
  if (autoUpdater) {
    autoUpdater.quitAndInstall();
  } else {
    app.quit();
  }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// Handle app single instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});