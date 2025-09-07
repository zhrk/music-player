const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getFiles: () => ipcRenderer.invoke('getFiles'),
  setColor: (color) => ipcRenderer.send('change-color', color),
});
