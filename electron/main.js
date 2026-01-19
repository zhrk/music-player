const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const log = require('electron-log/main');
const { APP_PATH, APP_URL, BG_COLOR, HEIGHT, isDev, WIDTH } = require('./app');
const getFiles = require('./getFiles');
const { setMenu } = require('./menu');
const server = require('./server');
const { setThumbar } = require('./thumbar');

if (!isDev) {
  log.initialize();
  log.eventLogger.startLogging();
  log.errorHandler.startCatching();
}

const protocol = app.name;
const gotTheLock = app.requestSingleInstanceLock();

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(protocol, process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient(protocol);
}

/**
 * @type {BrowserWindow}
 */
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
      width: WIDTH,
      minWidth: WIDTH,
      minHeight: HEIGHT,
      height: HEIGHT,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        devTools: true,
        webSecurity: false,
      },
      backgroundColor: BG_COLOR,
      titleBarStyle: 'hidden',
    });

    if (isDev) {
      win.loadURL(APP_URL);
    } else {
      win.loadFile(path.join(APP_PATH, 'build/index.html'));
    }

    const handleGetFiles = async () => {
      const files = await getFiles(app.getPath('music'));

      return files;
    };

    ipcMain.on('minimize', () => win.minimize());
    ipcMain.on('close', () => win.close());

    ipcMain.on('maximize', () => {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    });

    ipcMain.on('find', ({ text, forward }) => {
      if (text) {
        win.webContents.findInPage(text, { forward });
      } else {
        win.webContents.stopFindInPage('clearSelection');
      }
    });

    ipcMain.handle('getFiles', handleGetFiles);

    setMenu(win);
    setThumbar(win);
  });
}

app.on('before-quit', () => server.close());
