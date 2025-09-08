const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getFiles: () => ipcRenderer.invoke('getFiles'),
  app: {
    minimize: () => ipcRenderer.send('app', 'minimize'),
    maximize: () => ipcRenderer.send('app', 'maximize'),
    close: () => ipcRenderer.send('app', 'close'),
  },
});
