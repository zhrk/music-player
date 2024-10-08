type Files = {
  name: string;
  path: string | undefined;
  type: 'file' | 'directory';
  children: Files;
}[];

interface Window {
  electron: {
    initCSSVars: () => string;
    getFiles: () => Files;
  };
}

declare module '*.svg' {
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
