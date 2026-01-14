import clsx from 'clsx';
import PauseIcon from '../../static/icons/pause.svg';
import PlayIcon from '../../static/icons/play.svg';
import SkipNextIcon from '../../static/icons/skip-next.svg';
import SkipPreviousIcon from '../../static/icons/skip-previous.svg';
import { useAppStore } from '../../stores/app';
import { usePlayerStore } from '../../stores/player';
import { Progress } from '../Progress';
import { TrackCover } from '../TrackCover';
import { TrackInfo } from '../TrackInfo';
import { Volume } from '../Volume';
import styles from './styles.module.scss';

export const Controls = () => {
  const { fullscreen } = useAppStore((state) => ({ fullscreen: state.fullscreen }));

  const { src, playing, nextTrack, prevTrack, togglePlayPause } = usePlayerStore((state) => ({
    src: state.src,
    playing: state.playing,
    nextTrack: state.nextTrack,
    prevTrack: state.prevTrack,
    togglePlayPause: state.togglePlayPause,
  }));

  return (
    <div data-controls className={clsx(styles.container, fullscreen && styles.fullscreen)}>
      <Progress />
      <div className={styles.wrapper}>
        <TrackCover />
        <TrackInfo />
      </div>
      <div className={styles.buttons}>
        <button type="button" onClick={prevTrack}>
          <SkipPreviousIcon />
        </button>
        <button type="button" disabled={!src} onClick={togglePlayPause}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button type="button" onClick={nextTrack}>
          <SkipNextIcon />
        </button>
      </div>
      <Volume />
    </div>
  );
};
