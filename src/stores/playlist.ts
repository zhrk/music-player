import { takeLast } from 'remeda';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn as create } from 'zustand/traditional';
import { shallow } from 'zustand/vanilla/shallow';
import { usePlayerStore } from './player';

type Tracks = string[];
type Prev = number;

interface State {
  played: Tracks;
  queue: Tracks;
  prev: Prev;
  addToPlayed: (payload: Tracks[number]) => void;
  addToQueue: (payload: Tracks) => void;
  setQueue: (payload: Tracks) => void;
  setPrev: (payload: Prev) => void;
}

export const usePlaylistStore = create<State>()(
  persist(
    (set, get) => ({
      played: [],
      queue: [],
      prev: -1,
      addToPlayed: (payload) => set({ played: takeLast([...get().played, payload], 100) }),
      addToQueue: (payload) => {
        const { nextTrack } = usePlayerStore.getState();

        if (payload.length) {
          set({ queue: payload });
          nextTrack();
        }
      },
      setQueue: (payload) => set({ queue: payload }),
      setPrev: (payload) => set({ prev: payload }),
    }),
    { name: 'playlist' }
  ),
  shallow
);
