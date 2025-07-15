import { createWithEqualityFn as create } from 'zustand/traditional';
import Files from '../types/files';

interface State extends Files {
  getFiles: () => void;
}

export const useFilesStore = create<State>()((set) => ({
  files: [],
  flatFiles: [],
  rootPath: '',
  getFiles: async () => {
    const files = await window.electron.getFiles();

    set(files);
  },
}));

useFilesStore.getState().getFiles();
