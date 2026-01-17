const { Menu, MenuItem, screen } = require('electron');
const { DEVTOOLS_WIDTH, WIDTH } = require('./app');
const { createWinFind } = require('./find');

const menu = new Menu();

const setMenu = (win) => {
  const winFind = createWinFind(win);

  const menuFind = new MenuItem({
    click: () => winFind.show(),
    accelerator: 'CommandOrControl+F',
  });

  const menuDevTools = new MenuItem({
    click: () => win.webContents.toggleDevTools(),
    accelerator: 'F12',
  });

  menu.append(menuFind);

  menu.append(menuDevTools);

  const primaryDisplay = screen.getPrimaryDisplay();

  const { width } = primaryDisplay.workAreaSize;

  win.webContents.on('devtools-opened', () =>
    win.setBounds({ width: WIDTH + DEVTOOLS_WIDTH, x: (width - WIDTH - DEVTOOLS_WIDTH) / 2 })
  );

  win.webContents.on('devtools-closed', () =>
    win.setBounds({ width: WIDTH, x: (width - WIDTH) / 2 })
  );

  winFind.on('hide', () => {
    win.webContents.stopFindInPage('clearSelection');
    win.focus();
  });

  win.setMenu(menu);
};

module.exports = { setMenu };
