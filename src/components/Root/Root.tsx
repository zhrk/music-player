/* eslint-disable jsx-a11y/media-has-caption */

import { useState, useEffect, Dispatch, SetStateAction, useRef, useCallback } from 'react';
import Files from '../../types/files';
import encodePath from '../../utils/encodePath';
import styles from './styles.module.scss';

type Src = string | null;

const Item = (props: { data: Files[number]; setSrc: Dispatch<SetStateAction<Src>> }) => {
  const { data, setSrc } = props;

  const { name, type, path, children } = data;

  return (
    <div className={styles.children}>
      {type === 'file' ? (
        <button type="button" onClick={() => path && setSrc(path)}>
          {name}
        </button>
      ) : (
        name
      )}
      {type === 'file'
        ? null
        : children.map((item) => <Item key={item.name} data={item} setSrc={setSrc} />)}
    </div>
  );
};

const Root = () => {
  const [files, setFiles] = useState<Files>([]);

  const [src, setSrc] = useState<Src>(null);

  const fired = useRef(false);

  useEffect(() => {
    const initCSSVars = async () => {
      let vars = await window.electron.initCSSVars();

      vars = Object.entries(vars)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');

      const style = document.createElement('style');
      style.textContent = `:root { ${vars} }`;
      document.head.appendChild(style);
    };

    const getFiles = async () => {
      setFiles(await window.electron.getFiles());
    };

    initCSSVars();

    if (!fired.current) {
      getFiles();

      fired.current = true;
    }
  }, []);

  const ref = useCallback((node: HTMLAudioElement) => {
    if (node) {
      node.volume = 0.2;
    }
  }, []);

  return (
    <>
      <div className={styles.titleBar} />
      {src && <audio ref={ref} controls autoPlay src={`file:///${encodePath(src)}`} />}
      <div className={styles.tree}>
        {/* {JSON.stringify(files, null, 2)} */}
        {files.map((item) => (
          <Item key={item.name} data={item} setSrc={setSrc} />
        ))}
      </div>
    </>
  );
};

export { Root };
