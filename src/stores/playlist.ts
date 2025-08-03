import { takeLast } from 'remeda';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn as create } from 'zustand/traditional';
import { shallow } from 'zustand/vanilla/shallow';

type Played = string[];
type Prev = number;

interface State {
  played: Played;
  prev: Prev;
  addToPlayed: (payload: Played[number]) => void;
  setPrev: (payload: Prev) => void;
}

export const usePlaylistStore = create<State>()(
  persist(
    (set, get) => ({
      played: [],
      prev: -1,
      addToPlayed: (payload) => set({ played: takeLast([...get().played, payload], 100) }),
      setPrev: (payload) => set({ prev: payload }),
    }),
    { name: 'playlist' }
  ),
  shallow
);
