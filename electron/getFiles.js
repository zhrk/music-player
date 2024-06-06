const path = require("node:path");
const fs = require("node:fs");

const getFiles = (dirPath) => {
  const ignoredFolders = [".stfolder", "[OST]", "[Архив]", "[Яндекс.Музыка]"];

  let files = fs.readdirSync(dirPath, {
    withFileTypes: true,
    encoding: "utf-8",
  });

  files = files.filter((item) => !ignoredFolders.includes(item.name));

  files = files.flatMap((item) => {
    if (item.isDirectory()) {
      return getFiles(path.join(dirPath, item.name));
    }

    if (item.name.endsWith(".mp3")) return item.name;

    return [];
  });

  return files;
};

module.exports = getFiles;
