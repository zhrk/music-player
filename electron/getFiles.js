/* eslint-disable @typescript-eslint/no-var-requires */

const dree = require('dree');

async function getFiles(rootPath) {
  const files = dree.scan(rootPath, {
    extensions: ['mp3'],
    exclude: /.stfolder|\[OST\]|\[Архив\]|\[Яндекс.Музыка\]/,
    symbolicLinks: false,
    hash: false,
    showHidden: false,
    stat: true,
  });

  return files.children[1].children;
}

module.exports = getFiles;
