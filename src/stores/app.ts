import { createWithEqualityFn as create } from 'zustand/traditional';
import { shallow } from 'zustand/vanilla/shallow';

type Fullscreen = boolean;

interface State {
  fullscreen: Fullscreen;
  setFullscreen: (payload: Fullscreen) => void;
}

export const useAppStore = create<State>()(
  (set) => ({
    fullscreen: false,
    setFullscreen: (payload) => set({ fullscreen: payload }),
  }),
  shallow
);
