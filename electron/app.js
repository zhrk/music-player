const { app } = require('electron');

const isDev = !app.isPackaged;

const WIDTH = 1024;
const HEIGHT = 800;
const DEVTOOLS_WIDTH = 554;

const BG_COLOR = '#111';

module.exports = { BG_COLOR, DEVTOOLS_WIDTH, HEIGHT, isDev, WIDTH };
