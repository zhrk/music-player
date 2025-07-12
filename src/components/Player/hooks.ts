import { useEffect, useRef, useState } from 'react';
import Files from '../../types/files';

const useFiles = () => {
  const [files, setFiles] = useState<Files>([]);

  const fired = useRef(false);

  useEffect(() => {
    const getFiles = async () => {
      setFiles(await window.electron.getFiles());
    };

    if (!fired.current) {
      getFiles();

      fired.current = true;
    }
  }, []);

  return { files };
};

export { useFiles };
