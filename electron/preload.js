const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  initCSSVars: () => ipcRenderer.invoke('initCSSVars'),
  getFiles: () => ipcRenderer.invoke('getFiles'),
  setColor: (color) => ipcRenderer.send('change-color', color),
});
