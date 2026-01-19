const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getFiles: () => ipcRenderer.invoke('getFiles'),
  minimize: () => ipcRenderer.send('minimize', 'minimize'),
  maximize: () => ipcRenderer.send('maximize', 'maximize'),
  close: () => ipcRenderer.send('close', 'close'),
  find: (text, forward) => ipcRenderer.send('find', { text, forward }),
  onThumbarClick: (callback) => ipcRenderer.on('thumbar', (_, value) => callback(value)),
  setPlaying: (playing) => ipcRenderer.send('setPlaying', playing),
});
