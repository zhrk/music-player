import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlayerStore } from '../player';

vi.mock('../files', () => ({
  useFilesStore: {
    getState: vi.fn(() => ({
      flatFiles: Array.from({ length: 2000 }).map((_, index) => ({ path: `${index + 1}.mp3` })),
    })),
  },
}));

const getState = () => usePlayerStore.getState();

describe('usePlayerStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePlayerStore.setState({ src: null, queue: [], prev: 0 });
  });

  it('nextTrack: adds a random track and starts playback when queue is empty', () => {
    getState().nextTrack();

    const state = getState();

    expect(state.src).toBe(state.queue[0]);
  });

  it('nextTrack: does not repeat tracks from the last 100 played', () => {
    usePlayerStore.setState({
      queue: ['1.mp3', '2.mp3', '3.mp3'],
      prev: 0,
    });

    getState().nextTrack();

    const { src } = getState();

    expect(['1.mp3', '2.mp3', '3.mp3']).not.toContain(src);
  });

  it('nextTrack: limits the queue size to 100 tracks', () => {
    const longQueue = Array.from({ length: 100 }, (_, index) => `${index}.mp3`);

    usePlayerStore.setState({ queue: longQueue });

    getState().nextTrack();

    expect(getState().queue.length).toBe(100);
  });

  it('nextTrack: follows the queue order instead of random when navigating back', () => {
    usePlayerStore.setState({
      queue: ['1.mp3', '2.mp3', '3.mp3'],
      prev: -2,
    });

    getState().nextTrack();

    const state = getState();

    expect(state.prev).toBe(-1);
    expect(state.src).toBe('2.mp3');
  });

  it('prevTrack: replays the only track when queue has one item', () => {
    usePlayerStore.setState({
      queue: ['1.mp3'],
    });

    getState().prevTrack();

    expect(getState().src).toBe('1.mp3');
  });

  it('prevTrack: navigates backward through the queue', () => {
    usePlayerStore.setState({
      queue: ['1.mp3', '2.mp3', '3.mp3'],
      prev: 0,
    });

    getState().prevTrack();

    const state = getState();

    expect(state.prev).toBe(-1);
    expect(state.src).toBe('2.mp3');
  });

  it('playTrack: discards future tracks and resets navigation state', () => {
    usePlayerStore.setState({
      queue: ['1.mp3', '2.mp3', '3.mp3'],
      prev: -1,
    });

    getState().playTrack('10.mp3');

    const state = getState();

    expect(state.queue).toEqual(['1.mp3', '2.mp3', '10.mp3']);
    expect(state.prev).toBe(0);
    expect(state.src).toBe('10.mp3');
  });

  it('addToQueue: enqueues tracks and starts playback', () => {
    getState().addToQueue(['1.mp3', '2.mp3']);

    const state = getState();

    expect(state.queue).toEqual(['1.mp3', '2.mp3']);
    expect(state.prev).toBe(-1);
    expect(state.src).toBe('1.mp3');
  });

  it('addToQueue: appends tracks to the end of the queue', () => {
    usePlayerStore.setState({
      queue: ['1.mp3'],
      prev: -1,
    });

    getState().addToQueue(['2.mp3', '3.mp3']);

    const state = getState();

    expect(state.queue).toEqual(['1.mp3', '2.mp3', '3.mp3']);
    expect(state.prev).toBe(-3);
  });

  it('clearQueue: removes all tracks after the current one', () => {
    usePlayerStore.setState({
      queue: ['1.mp3', '2.mp3', '3.mp3'],
      prev: -1,
    });

    getState().clearQueue();

    const state = getState();

    expect(state.queue).toEqual(['1.mp3', '2.mp3']);
    expect(state.prev).toBe(0);
  });
});
