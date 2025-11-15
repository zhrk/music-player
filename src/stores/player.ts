import { takeLast } from 'remeda';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn as create } from 'zustand/traditional';
import { shallow } from 'zustand/vanilla/shallow';
import { useFilesStore } from './files';

type Playing = boolean;
type Src = string | null;
type Element = HTMLAudioElement | null;
type Volume = number;
type Progress = number;
type Tracks = string[];
type Prev = number;

interface State {
  element: Element;
  src: Src;
  playing: Playing;
  volume: Volume;
  progress: Progress;
  total: Progress;
  played: Tracks;
  queue: Tracks;
  prev: Prev;
  nextTrack: () => void;
  prevTrack: () => void;
  setElement: (payload: Element) => void;
  setPlaying: (payload: Playing) => void;
  setSrc: (payload: Src) => void;
  setVolume: (payload: Volume) => void;
  setProgress: (payload: Progress) => void;
  setTotal: (payload: Progress) => void;
  addToPlayed: (payload: Tracks[number]) => void;
  addToQueue: (payload: Tracks) => void;
  setQueue: (payload: Tracks) => void;
  clearQueue: () => void;
  setPrev: (payload: Prev) => void;
}

export const usePlayerStore = create<State>()(
  persist(
    (set, get) => ({
      element: null,
      src: null,
      playing: false,
      volume: 0.05,
      progress: 0,
      total: 0,
      played: [],
      queue: [],
      prev: -1,
      nextTrack: () => {
        const { nextTrack } = get();
        const { played, prev, queue, setPrev, setQueue } = get();
        const { flatFiles } = useFilesStore.getState();

        if (prev < -1) {
          set({ src: played.at(prev + 1) });
          setPrev(prev + 1);
        } else if (queue.length) {
          const [queueTrack, ...rest] = queue;

          set({ src: queueTrack });
          setQueue(rest);
          get().addToPlayed(queueTrack);
        } else {
          const randomTrack = flatFiles[Math.floor(Math.random() * flatFiles.length)].path;

          if (played.includes(randomTrack)) {
            nextTrack();
          } else {
            set({ src: randomTrack });
            get().addToPlayed(randomTrack);
          }
        }
      },
      prevTrack: () => {
        const playlistStore = get();
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
      addToPlayed: (payload) => set({ played: takeLast([...get().played, payload], 100) }),
      addToQueue: (payload) => {
        const { nextTrack } = usePlayerStore.getState();

        if (payload.length) {
          set({ queue: payload });
          nextTrack();
        }
      },
      setQueue: (payload) => set({ queue: payload }),
      clearQueue: () => {
        set({ queue: [] });
        get().nextTrack();
      },
      setPrev: (payload) => set({ prev: payload }),
    }),
    {
      name: 'player',
      partialize: (state) => ({ played: state.played, queue: state.queue, prev: state.prev }),
      onRehydrateStorage: () => (state) => {
        const src = state?.played.at(state.prev);

        if (src) state?.setSrc(src);
      },
    }
  ),
  shallow
);
