const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getFiles: () => ipcRenderer.invoke('getFiles'),
  onThumbarClick: (callback) => ipcRenderer.on('thumbar', (_, value) => callback(value)),
  setPlaying: (playing) => ipcRenderer.send('setPlaying', playing),
  app: {
    minimize: () => ipcRenderer.send('app', 'minimize'),
    maximize: () => ipcRenderer.send('app', 'maximize'),
    close: () => ipcRenderer.send('app', 'close'),
    find: (text, forward) => ipcRenderer.send('app', 'find', { text, forward }),
  },
});
