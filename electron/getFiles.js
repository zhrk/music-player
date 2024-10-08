/* eslint-disable @typescript-eslint/no-var-requires */

const dirTree = require('directory-tree');

async function getFiles(rootPath) {
  const files = dirTree(rootPath, {
    extensions: /\.mp3/,
    exclude: /.stfolder|\[OST\]|\[Архив\]|\[Яндекс.Музыка\]/,
    attributes: ['path', 'type'],
  });

  return files.children[1].children;
}

module.exports = getFiles;
