type Files = {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children: Files;
}[];

interface Window {
  electron: {
    getFiles: () => Promise<{ files: Files; flatFiles: Files; rootPath: string }>;
    onThumbarClick: (callback: (payload: 'next' | 'prev' | 'play' | 'pause') => void) => void;
    setPlaying: (playing: boolean) => void;
    app: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      openFind: (callback: () => void) => void;
      find: (text: string, forward?: boolean) => void;
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
