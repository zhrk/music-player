const { Menu, MenuItem, screen } = require('electron');
const { DEVTOOLS_WIDTH, isDev, WIDTH } = require('./app');

const menu = new Menu();

const setMenu = (win) => {
  const menuDevTools = new MenuItem({
    click: () => win.webContents.toggleDevTools(),
    accelerator: 'F12',
  });

  if (isDev) {
    menu.append(menuDevTools);

    const primaryDisplay = screen.getPrimaryDisplay();

    const { width } = primaryDisplay.workAreaSize;

    win.webContents.on('devtools-opened', () =>
      win.setBounds({ width: WIDTH + DEVTOOLS_WIDTH, x: (width - WIDTH - DEVTOOLS_WIDTH) / 2 })
    );

    win.webContents.on('devtools-closed', () =>
      win.setBounds({ width: WIDTH, x: (width - WIDTH) / 2 })
    );
  }

  win.setMenu(menu);
};

module.exports = { setMenu };
