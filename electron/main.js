const path = require('node:path');
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const getFiles = require('./getFiles');
require('./server');

const protocol = app.name;
const isDev = !app.isPackaged;
const gotTheLock = app.requestSingleInstanceLock();

const WIDTH = 1024;
const HEIGHT = 800;
const DEVTOOLS_WIDTH = 554;

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(protocol, process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient(protocol);
}

const BG_COLOR = '#111';

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
      width: WIDTH + DEVTOOLS_WIDTH,
      minWidth: WIDTH,
      minHeight: HEIGHT,
      height: HEIGHT,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        devTools: isDev,
        webSecurity: false,
      },
      backgroundColor: BG_COLOR,
      titleBarStyle: 'hidden',
    });

    win.loadURL(`http://localhost:4444`);
    win.removeMenu();

    if (isDev) {
      win.webContents.openDevTools();

      const primaryDisplay = screen.getPrimaryDisplay();

      const { width } = primaryDisplay.workAreaSize;

      win.webContents.on('devtools-closed', () => {
        win.setBounds({ width: WIDTH, x: (width - WIDTH) / 2 });
      });
    }

    // win.hide();
    // win.maximize();
    // win.show();
    // win.webContents.openDevTools();

    const handleGetFiles = async () => {
      const files = await getFiles(app.getPath('music'));

      return files;
    };

    ipcMain.on('app', (_, action) => {
      if (!win) return;

      if (action === 'minimize') win.minimize();

      if (action === 'maximize') {
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }

      if (action === 'close') win.close();
    });

    ipcMain.handle('getFiles', handleGetFiles);
  });
}
