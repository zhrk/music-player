import { createWithEqualityFn as create } from 'zustand/traditional';
import { shallow } from 'zustand/vanilla/shallow';
import { usePlaylistStore } from './playlist';

type Playing = boolean;
type Src = string | null;
type Element = HTMLAudioElement | null;
type Volume = number;
type Progress = number;

interface State {
  element: Element;
  src: Src;
  playing: Playing;
  volume: Volume;
  progress: Progress;
  total: Progress;
  setElement: (payload: Element) => void;
  setPlaying: (payload: Playing) => void;
  setSrc: (payload: Src) => void;
  setVolume: (payload: Volume) => void;
  setProgress: (payload: Progress) => void;
  setTotal: (payload: Progress) => void;
}

export const usePlayerStore = create<State>()(
  (set, get) => ({
    element: null,
    src: usePlaylistStore.getState().played.at(-1) || null,
    playing: false,
    volume: 0.05,
    progress: 0,
    total: 0,
    setElement: (payload) => {
      if (payload) payload.volume = get().volume;

      set({ element: payload });
    },
    setPlaying: (payload) => set({ playing: payload }),
    setSrc: (payload) => {
      set({ src: payload });

      if (payload) usePlaylistStore.getState().addToPlayed(payload);
    },
    setVolume: (payload) => set({ volume: payload }),
    setProgress: (payload) => set({ progress: payload }),
    setTotal: (payload) => set({ total: payload }),
  }),
  shallow
);
