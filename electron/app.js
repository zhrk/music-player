const { app } = require('electron');

const isDev = !app.isPackaged;

const APP_PATH = app.getAppPath();

const APP_URL = 'http://localhost:4444';

const WIDTH = 1024;
const HEIGHT = 800;
const DEVTOOLS_WIDTH = 554;

const BG_COLOR = '#111';

module.exports = { APP_PATH, APP_URL, BG_COLOR, DEVTOOLS_WIDTH, HEIGHT, isDev, WIDTH };
