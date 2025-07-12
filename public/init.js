const initCSSVars = async () => {
  let vars = await window.electron.initCSSVars();

  vars = Object.entries(vars)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');

  const style = document.createElement('style');
  style.textContent = `:root { ${vars} }`;
  document.head.appendChild(style);
};

initCSSVars();
