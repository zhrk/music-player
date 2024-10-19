/* eslint-disable @typescript-eslint/no-require-imports */

const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  initCSSVars: () => ipcRenderer.invoke('initCSSVars'),
  getFiles: () => ipcRenderer.invoke('getFiles'),
});
