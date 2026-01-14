import { takeLast } from 'remeda';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn as create } from 'zustand/traditional';
import { shallow } from 'zustand/vanilla/shallow';
import encodePath from '../utils/encodePath';
import { useFilesStore } from './files';

let audio: HTMLAudioElement | null = null;

type Playing = boolean;
type Src = string | null;
type Volume = number;
type Progress = number;
type Tracks = string[];

interface State {
  src: Src;
  playing: Playing;
  volume: Volume;
  progress: Progress;
  total: Progress;
  played: Tracks;
  queue: Tracks;
  prev: number;
  setSrc: (payload: Src) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (payload: Progress) => void;
  setVolume: (payload: Volume) => void;
  addToPlayed: (payload: Tracks[number]) => void;
  addToQueue: (payload: Tracks) => void;
  clearQueue: () => void;
}

export const usePlayerStore = create<State>()(
  persist(
    (set, get) => ({
      src: null,
      playing: false,
      volume: 0.05,
      progress: 0,
      total: 0,
      played: [],
      queue: [],
      prev: -1,
      setSrc: (payload) => {
        const { volume, nextTrack } = get();

        set({ src: payload });

        if (!audio) {
          audio = new Audio();
          audio.volume = volume;

          audio.addEventListener('ended', () => nextTrack());
          audio.addEventListener('play', () => set({ playing: true }));
          audio.addEventListener('pause', () => set({ playing: false }));

          audio.addEventListener('loadedmetadata', () => {
            if (audio) set({ total: Math.floor(audio.duration) });
          });

          audio.addEventListener('timeupdate', () => {
            if (audio) set({ progress: Math.floor(audio.currentTime) });
          });

          audio.addEventListener('volumechange', () => {
            if (audio) set({ volume: audio.volume });
          });

          audio.addEventListener('canplay', () => {
            if (audio) audio.play();
          });
        }

        if (audio && payload) {
          audio.src = `file:///${encodePath(payload)}`;
        }
      },
      togglePlayPause: () => {
        if (audio) {
          if (get().playing) {
            audio.pause();
          } else {
            audio.play();
          }
        }
      },
      nextTrack: () => {
        const { played, prev, queue, addToPlayed, nextTrack, setSrc } = get();
        const { flatFiles } = useFilesStore.getState();

        if (prev < -1) {
          const src = played.at(prev + 1);

          if (src) {
            setSrc(src);
            set({ prev: prev + 1 });
          }
        } else if (queue.length) {
          const [queueTrack, ...rest] = queue;

          setSrc(queueTrack);
          set({ queue: rest });
          addToPlayed(queueTrack);
        } else {
          const randomTrack = flatFiles[Math.floor(Math.random() * flatFiles.length)].path;

          if (played.includes(randomTrack)) {
            nextTrack();
          } else {
            setSrc(randomTrack);
            addToPlayed(randomTrack);
          }
        }
      },
      prevTrack: () => {
        const { src, played, setSrc } = get();

        if (played.length) {
          let prev = get().prev;

          if (Math.abs(prev) !== played.length && src) {
            prev = prev - 1;

            if (prev === -1) prev = -2;

            const prevSrc = played.at(prev);

            if (prevSrc) {
              setSrc(prevSrc);
              set({ prev });
            }
          }
        }
      },
      seek: (payload) => {
        if (audio) {
          audio.currentTime = Number(payload);
        }
      },
      setVolume: (payload) => {
        if (audio) {
          audio.volume = payload;
        }
      },
      addToPlayed: (payload) => set({ played: takeLast([...get().played, payload], 100) }),
      addToQueue: (payload) => {
        const { queue, nextTrack } = get();

        if (queue.length) {
          set({ queue: [...queue, ...payload] });
        } else {
          set({ queue: payload });
          nextTrack();
        }
      },
      clearQueue: () => {
        set({ queue: [] });
        get().nextTrack();
      },
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
