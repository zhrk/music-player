const fs = require("node:fs");
const path = require("node:path");
const dirTree = require("directory-tree");

async function getFiles(rootPath) {
  const files = dirTree(rootPath, {
    extensions: /\.mp3/,
    exclude: /.stfolder|\[OST\]|\[Архив\]|\[Яндекс.Музыка\]/,
    attributes: ["type"],
  });

  return files.children[0].children;
}

module.exports = getFiles;
