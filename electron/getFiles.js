/* eslint-disable @typescript-eslint/no-require-imports */

const dree = require('dree');

async function getFiles(rootPath) {
  const flatFiles = [];

  const files = dree.scan(
    rootPath,
    {
      extensions: ['mp3'],
      exclude: /.stfolder|\[Архив\]|\[Яндекс.Музыка\]/,
      symbolicLinks: false,
      hash: false,
      showHidden: false,
      stat: true,
    },
    (file) => flatFiles.push(file)
  );

  return {
    files: files.children[0].children,
    flatFiles,
  };
}

module.exports = getFiles;
