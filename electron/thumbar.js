const path = require('node:path');
const { ipcMain, nativeImage } = require('electron');

const setThumbar = (win) => {
  const set = (playing) => {
    win.setThumbarButtons([
      {
        icon: nativeImage.createFromPath(path.join(__dirname, 'icons/skip-previous.png')),
        click: () => win.webContents.send('thumbar', 'prev'),
      },
      {
        icon: nativeImage.createFromPath(path.join(__dirname, 'icons/play.png')),
        click: () => win.webContents.send('thumbar', 'play'),
        ...(playing && { flags: ['hidden'] }),
      },
      {
        icon: nativeImage.createFromPath(path.join(__dirname, 'icons/pause.png')),
        click: () => win.webContents.send('thumbar', 'pause'),
        ...(!playing && { flags: ['hidden'] }),
      },
      {
        icon: nativeImage.createFromPath(path.join(__dirname, 'icons/skip-next.png')),
        click: () => win.webContents.send('thumbar', 'next'),
      },
    ]);
  };

  set(false);

  ipcMain.on('setPlaying', (_, playing) => set(playing));
};

module.exports = { setThumbar };
