const encodePath = (path: string) => {
  let urlPath = path.replace(/\\/g, '/');

  urlPath = urlPath.replace(/[^a-zA-Z0-9/_.-]/g, (match) => encodeURIComponent(match));

  return urlPath;
};

export default encodePath;
