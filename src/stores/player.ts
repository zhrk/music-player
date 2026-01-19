import { takeLast } from 'remeda';
import { persist, subscribeWithSelector } from 'zustand/middleware';
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
  queue: Tracks;
  prev: number;
  setSrc: (payload: { src: Src; play?: boolean }) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  playTrack: (src: Src) => void;
  seek: (payload: Progress) => void;
  setVolume: (payload: Volume) => void;
  addToQueue: (payload: Tracks) => void;
  clearQueue: () => void;
}

export const usePlayerStore = create<State>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        src: null,
        playing: false,
        volume: 0.05,
        progress: 0,
        total: 0,
        queue: [],
        prev: 0,
        setSrc: (payload) => {
          const { src, play = true } = payload;

          const { volume, nextTrack } = get();

          set({ src });

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
          }

          if (audio && src) {
            audio.src = `file:///${encodePath(src)}`;
          }

          if (play) audio.play();
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
        playTrack: (payload) => {
          const { queue, prev, setSrc } = get();

          if (payload) {
            setSrc({ src: payload });
            set({ prev: 0, queue: [...queue.slice(0, prev), payload] });
          }
        },
        nextTrack: () => {
          const { prev, queue, setSrc } = get();
          const { flatFiles } = useFilesStore.getState();

          const filesPaths = flatFiles.map((file) => file.path);
          const available = filesPaths.filter((path) => !queue.includes(path));

          const files = available.length
            ? available
            : filesPaths.filter((path) => path !== get().src);

          const randomTrack = files.at(Math.floor(Math.random() * files.length));

          if (!prev) {
            if (randomTrack) {
              const temp = takeLast([...queue, randomTrack], 100);

              set({ queue: temp });
              setSrc({ src: temp[temp.length - 1] });
            }
          } else {
            setSrc({ src: queue[queue.length - 1 + prev + 1] });
            set({ prev: prev + 1 });
          }
        },
        prevTrack: () => {
          const { queue, setSrc } = get();

          if (queue.length === 1) {
            setSrc({ src: queue[0] });
          }

          if (queue.length > 1) {
            const prev = get().prev - 1;

            const src = queue.at(prev - 1);

            if (src) {
              set({ prev });
              setSrc({ src });
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
        addToQueue: (payload) => {
          const { prev, nextTrack } = get();

          const queue = get().queue.toReversed();

          if (prev) {
            set({ queue: [...get().queue, ...payload], prev: prev - payload.length });
          } else {
            set({ queue: [...queue.toReversed(), ...payload], prev: -payload.length });
            nextTrack();
          }
        },
        clearQueue: () => {
          const { queue, prev } = get();

          set({ queue: queue.slice(0, prev), prev: 0 });
        },
      }),
      {
        name: 'player',
        partialize: (state) => ({ queue: state.queue, prev: state.prev }),
        onRehydrateStorage: () => (state) => {
          const src = state?.queue.toReversed().at(state.prev);

          if (src) state?.setSrc({ src, play: false });
        },
      }
    )
  ),
  shallow
);

window.electron.onThumbarClick((event) => {
  if (event === 'prev') usePlayerStore.getState().prevTrack();
  if (event === 'next') usePlayerStore.getState().nextTrack();
  if (event === 'play' || event === 'pause') usePlayerStore.getState().togglePlayPause();
});

usePlayerStore.subscribe((state) => state.playing, window.electron.setPlaying);
