const dree = require('dree');

const getFiles = (rootPath) => {
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
    flatFiles,
    rootPath: files.children[0].path,
    files: files.children[0].children,
  };
};

module.exports = getFiles;
