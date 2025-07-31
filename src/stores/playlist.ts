import { takeLast } from 'remeda';
import { createWithEqualityFn as create } from 'zustand/traditional';
import { shallow } from 'zustand/vanilla/shallow';

type Played = string[];

interface State {
  played: Played;
  addToPlayed: (payload: Played[number]) => void;
}

export const usePlaylistStore = create<State>()(
  (set) => ({
    played: [],
    addToPlayed: (payload) =>
      set((state) => ({ played: takeLast([...state.played, payload], 100) })),
  }),
  shallow
);
