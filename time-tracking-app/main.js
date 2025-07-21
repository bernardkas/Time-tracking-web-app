const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');
const express = require('express');
const path = require('path');
const url = require('url');
const { GlobalKeyboardListener } = require('node-global-key-listener');

const authRoutes = require('./routes/signin-routes');
const activityRoutes = require('./routes/active-routes');
const userRoutes = require('./routes/user-routes');
const employeeRoutes = require('./routes/employee-routes');
const uploadToS3Routes = require('./routes/upload-to-s3-routes');
const bodyParser = require('body-parser');

// Set up the Express server
const server = express();
const PORT = 3000;

const keyboardListener = new GlobalKeyboardListener();

let mainWindow;

server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

server.use('/api/auth/signin', authRoutes);
server.use(userRoutes);
server.use(employeeRoutes);
server.use(activityRoutes);
server.use(uploadToS3Routes);

// Start the Express server
server.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

let screenshotInterval;

ipcMain.on('start-listening', event => {
  // Start listening to keyboard and mouse events
  keyboardListener.addListener(event => {
    // Filter out mouse move events
    // if (event.name.includes('MOVE')) return;

    // Send only relevant events to React
    if (mainWindow) mainWindow.webContents.send('activity', event);
  });

  screenshotInterval = setInterval(async () => {
    const screenshot = await captureScreenshot();

    if (mainWindow) {
      mainWindow.webContents.send('screenshot', screenshot);
    }
  }, 1 * 60 * 1000); // 5 minutes
});

ipcMain.on('stop-listening', () => {
  keyboardListener.removeListener(); // Stop listening

  if (screenshotInterval) {
    clearInterval(screenshotInterval);
    screenshotInterval = null;
  }
});

async function captureScreenshot() {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: 800,
        height: 600,
      },
    });

    return sources.map(source => ({
      id: source.id,
      name: source.name,
      image: source.thumbnail.toDataURL(),
    }));
  } catch (error) {
    console.error('Screen capture failed:', error);
    throw error;
  }
}

// Create the main Electron window
function createMainWindow() {
  const isDev = process.env.NODE_ENV === 'development';

  mainWindow = new BrowserWindow({
    title: 'Time Tracking App',
    width: 600,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true, // Important if you're using nodeIntegration
      webSecurity: false, // For easier development, but disable in production
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });

  // Open developer tools
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.openDevTools();
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3001');
  } else {
    const startUrl = url.format({
      pathname: path.join(__dirname, 'app/build/index.html'),
      protocol: 'file:',
      slashes: true,
    });
    mainWindow.loadURL(startUrl);
  }
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
