import { useState, useEffect } from 'react';
import Files from '../../types/files';
import styles from './styles.module.scss';

const Item = (props: { data: Files[number] }) => {
  const { data } = props;

  const { name, type, children } = data;

  return (
    <div className={styles.children}>
      {name}
      {type === 'file' ? null : children.map((item) => <Item data={item} />)}
    </div>
  );
};

const Root = () => {
  const [files, setFiles] = useState<Files>([]);

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
    getFiles();
  }, []);

  return (
    <>
      <div className={styles.titleBar} />
      <div className={styles.tree}>
        {/* {JSON.stringify(files, null, 2)} */}
        {files.map((item) => (
          <Item key={item.name} data={item} />
        ))}
      </div>
    </>
  );
};

export { Root };
