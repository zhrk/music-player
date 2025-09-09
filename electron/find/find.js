const path = require('node:path');
const { BrowserWindow, Menu, MenuItem } = require('electron');
const { APP_URL } = require('../app');

const menu = new Menu();

const createWinFind = (mainWin) => {
  const win = new BrowserWindow({
    width: 300,
    height: 64,
    show: false,
    parent: mainWin,
    resizable: false,
    transparent: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
    },
  });

  const menuClose = new MenuItem({
    click: () => win.hide(),
    accelerator: 'ESC',
  });

  menu.append(menuClose);

  win.setMenu(menu);

  win.loadURL(`${APP_URL}/find`);

  return win;
};

module.exports = { createWinFind };
