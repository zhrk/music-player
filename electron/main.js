const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const getFiles = require('./getFiles');
require('./server');

const protocol = app.name;
const isDev = !app.isPackaged;
const gotTheLock = app.requestSingleInstanceLock();

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(protocol, process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient(protocol);
}

const BG_COLOR = '#111';
const TITLE_BAR_HEIGHT = 32;

let win;

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();

      win.focus();
    }
  });

  app.whenReady().then(() => {
    win = new BrowserWindow({
      width: 1024,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        devTools: isDev,
        webSecurity: false,
      },
      backgroundColor: BG_COLOR,
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: BG_COLOR,
        symbolColor: '#fff',
        height: TITLE_BAR_HEIGHT,
      },
    });

    win.loadURL(`http://localhost:4444`);
    win.removeMenu();

    if (isDev) {
      win.webContents.openDevTools();
    }

    // win.hide();
    // win.maximize();
    // win.show();
    // win.webContents.openDevTools();

    const handleInitCSSVars = () => ({
      '--app-title-bar-height': `${TITLE_BAR_HEIGHT}px`,
    });

    const handleGetFiles = async () => {
      const files = await getFiles(app.getPath('music'));

      return files;
    };

    ipcMain.handle('initCSSVars', handleInitCSSVars);
    ipcMain.handle('getFiles', handleGetFiles);

    ipcMain.on('change-color', (_, color) => win.setTitleBarOverlay({ color }));
  });
}
