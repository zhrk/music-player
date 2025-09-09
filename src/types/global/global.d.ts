type Files = {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children: Files;
}[];

interface Window {
  electron: {
    getFiles: () => Promise<{ files: Files; flatFiles: Files; rootPath: string }>;
    app: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      find: (text: string) => void;
      openFind: (callback: () => void) => void;
    };
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
