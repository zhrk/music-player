const borderMargin = 0.05;

export const getAverageColor = (img: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  const w = img.naturalWidth;
  const h = img.naturalHeight;
  canvas.width = w;
  canvas.height = h;

  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, w, h);

  const marginX = Math.floor(w * borderMargin);
  const marginY = Math.floor(h * borderMargin);

  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isEdge = x < marginX || x > w - marginX || y < marginY || y > h - marginY;
      if (isEdge) {
        const i = (y * w + x) * 4;
        const alpha = data[i + 3];
        if (alpha > 0) {
          r = r + data[i];
          g = g + data[i + 1];
          b = b + data[i + 2];
          count++;
        }
      }
    }
  }

  if (count === 0) return null;

  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  return `rgb(${r},${g},${b})`;
};
