import { create } from 'zustand';

type Playing = boolean;
type Src = string | null;
type Element = HTMLAudioElement | null;
type Volume = number;

const DEFAULT_VOLUME: Volume = 0.01;

interface State {
  element: Element;
  src: Src;
  playing: Playing;
  volume: Volume;
  setElement: (payload: Element) => void;
  setPlaying: (payload: Playing) => void;
  setSrc: (payload: Src) => void;
  setVolume: (payload: Volume) => void;
}

export const usePlayerStore = create<State>()((set) => ({
  element: null,
  src: null,
  playing: false,
  volume: 0.01,
  setElement: (payload) => {
    if (payload) payload.volume = DEFAULT_VOLUME;

    set({ element: payload });
  },
  setPlaying: (payload) => set({ playing: payload }),
  setSrc: (payload) => set({ src: payload }),
  setVolume: (payload) => set({ volume: payload }),
}));
