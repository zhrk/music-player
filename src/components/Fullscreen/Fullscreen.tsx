import clsx from 'clsx';
import { useState } from 'react';
import PauseIcon from '../../static/icons/pause.svg';
import PlayIcon from '../../static/icons/play.svg';
import SkipNextIcon from '../../static/icons/skip-next.svg';
import SkipPreviousIcon from '../../static/icons/skip-previous.svg';
import { useAppStore } from '../../stores/app';
import { usePlayerStore } from '../../stores/player';
import { getAverageColor } from '../../utils/getAverageColor';
import { TrackInfo } from '../TrackInfo';
import { Volume } from '../Volume';
import styles from './styles.module.scss';

export const Fullscreen = () => {
  const setFullscreen = useAppStore((state) => state.setFullscreen);

  const src = usePlayerStore((state) => state.src);
  const playing = usePlayerStore((state) => state.playing);
  const nextTrack = usePlayerStore((state) => state.nextTrack);
  const prevTrack = usePlayerStore((state) => state.prevTrack);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);

  const [maximized, setMaximized] = useState(false);
  const [color, setColor] = useState<string | null>(null);

  if (!src) return null;

  return (
    <div
      className={clsx(styles.container, maximized && styles.maximized)}
      {...(color && { style: { backgroundColor: color } })}
    >
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          {!maximized && <TrackInfo fullscreen />}
          <button
            type="button"
            className={styles.cover}
            onContextMenu={() => setFullscreen(false)}
            onClick={() => setMaximized((prev) => !prev)}
          >
            <img
              alt=""
              src={`http://localhost:4445/cover?src=${encodeURIComponent(src)}`}
              onLoad={(e) => {
                const averageColor = getAverageColor(e.currentTarget);

                if (averageColor) setColor(averageColor);
              }}
            />
          </button>
          {!maximized && <Volume fullscreen />}
        </div>
        {!maximized && (
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
        )}
      </div>
    </div>
  );
};
