import PauseIcon from '../../static/icons/pause.svg';
import PlayIcon from '../../static/icons/play.svg';
import SkipNextIcon from '../../static/icons/skip-next.svg';
import SkipPreviousIcon from '../../static/icons/skip-previous.svg';
import { usePlayerStore } from '../../stores/player';
import { Progress } from '../Progress';
import { TrackCover } from '../TrackCover';
import { TrackInfo } from '../TrackInfo';
import { Volume } from '../Volume';
import styles from './styles.module.scss';

export const Controls = () => {
  const src = usePlayerStore((state) => state.src);
  const playing = usePlayerStore((state) => state.playing);
  const nextTrack = usePlayerStore((state) => state.nextTrack);
  const prevTrack = usePlayerStore((state) => state.prevTrack);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);

  return (
    <div className={styles.container}>
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
