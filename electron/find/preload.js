const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  app: {
    find: (text, forward) => ipcRenderer.send('app', 'find', { text, forward }),
  },
});
