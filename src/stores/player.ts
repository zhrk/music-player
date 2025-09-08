import { createWithEqualityFn as create } from 'zustand/traditional';
import { shallow } from 'zustand/vanilla/shallow';
import { useFilesStore } from './files';
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
  nextTrack: () => void;
  prevTrack: () => void;
  setElement: (payload: Element) => void;
  setPlaying: (payload: Playing) => void;
  setSrc: (payload: Src) => void;
  setVolume: (payload: Volume) => void;
  setProgress: (payload: Progress) => void;
  setTotal: (payload: Progress) => void;
}

export const usePlayerStore = create<State>()((set, get) => {
  const { played: initialPlayed, prev: initialPrev } = usePlaylistStore.getState();

  return {
    element: null,
    src: initialPlayed.at(initialPrev) || null,
    playing: false,
    volume: 0.05,
    progress: 0,
    total: 0,
    nextTrack: () => {
      const { nextTrack } = get();
      const { played, prev, queue, setPrev, setQueue } = usePlaylistStore.getState();
      const { flatFiles } = useFilesStore.getState();

      if (prev < -1) {
        set({ src: played.at(prev + 1) });
        setPrev(prev + 1);
      } else if (queue.length) {
        const [queueTrack, ...rest] = queue;

        set({ src: queueTrack });
        setQueue(rest);
        usePlaylistStore.getState().addToPlayed(queueTrack);
      } else {
        const randomTrack = flatFiles[Math.floor(Math.random() * flatFiles.length)].path;

        if (played.includes(randomTrack)) {
          nextTrack();
        } else {
          set({ src: randomTrack });
          usePlaylistStore.getState().addToPlayed(randomTrack);
        }
      }
    },
    prevTrack: () => {
      const playlistStore = usePlaylistStore.getState();
      const { played, setPrev } = playlistStore;

      if (played.length) {
        let prev = playlistStore.prev;

        if (Math.abs(prev) !== played.length && get().src) {
          prev = prev - 1;

          if (prev === -1) prev = -2;

          set({ src: played.at(prev) });
          setPrev(prev);
        }
      }
    },
    setElement: (payload) => {
      if (payload) payload.volume = get().volume;

      set({ element: payload });
    },
    setPlaying: (payload) => set({ playing: payload }),
    setSrc: (payload) => set({ src: payload }),
    setVolume: (payload) => set({ volume: payload }),
    setProgress: (payload) => set({ progress: payload }),
    setTotal: (payload) => set({ total: payload }),
  };
}, shallow);
