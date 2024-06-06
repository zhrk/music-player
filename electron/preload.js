const { ipcRenderer } = require("electron");

ipcRenderer.on("getFiles", (_, value) => {
  document.getElementById("files").innerText = value;
});

ipcRenderer.on("initCssVars", (_, value) => {
  const vars = Object.entries(value)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");

  const style = document.createElement("style");
  style.textContent = `:root { ${vars} }`;
  document.head.appendChild(style);
});
