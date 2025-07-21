// preload.js

const { contextBridge, ipcRenderer } = require('electron');

// Expose IPC to React via contextBridge (safe API for renderer process)
contextBridge.exposeInMainWorld('electron', {
  startListening: () => ipcRenderer.send('start-listening'),
  stopListening: () => ipcRenderer.send('stop-listening'),
  onActivity: callback => {
    ipcRenderer.on('activity', (event, data) => {
      callback(data); // Forward data to React
    });
  },
  onScreenshot: callback => {
    ipcRenderer.on('screenshot', (event, data) => {
      callback(data);
    });
  },
});
