/* eslint-disable @typescript-eslint/no-var-requires */

const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  initCSSVars: () => ipcRenderer.invoke('initCSSVars'),
  getFiles: () => ipcRenderer.invoke('getFiles'),
});
