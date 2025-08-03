import clsx from 'clsx';
import { useCallback } from 'react';
import usePrevious from '../../hooks/usePrevious';
import PauseIcon from '../../static/icons/pause.svg';
import PlayIcon from '../../static/icons/play.svg';
import SkipNextIcon from '../../static/icons/skip-next.svg';
import SkipPreviousIcon from '../../static/icons/skip-previous.svg';
import { useAppStore } from '../../stores/app';
import { usePlayerStore } from '../../stores/player';
import encodePath from '../../utils/encodePath';
import { Progress } from '../Progress';
import { TrackCover } from '../TrackCover';
import { Volume } from '../Volume';
import styles from './styles.module.scss';

export const Controls = () => {
  const { fullscreen } = useAppStore((state) => ({ fullscreen: state.fullscreen }));

  const {
    src,
    element,
    playing,
    setElement,
    setPlaying,
    setProgress,
    setTotal,
    nextTrack,
    prevTrack,
  } = usePlayerStore((state) => ({
    src: state.src,
    element: state.element,
    playing: state.playing,
    setElement: state.setElement,
    setPlaying: state.setPlaying,
    setProgress: state.setProgress,
    setTotal: state.setTotal,
    nextTrack: state.nextTrack,
    prevTrack: state.prevTrack,
  }));

  const callbackRef = useCallback(
    (node: HTMLAudioElement) => {
      if (node) setElement(node);
    },
    [setElement]
  );

  const prevSrc = usePrevious(src);

  return (
    <>
      <audio
        ref={callbackRef}
        onEnded={() => nextTrack()}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onCanPlay={(event) => src !== prevSrc && event.currentTarget.play()}
        onTimeUpdate={(event) => setProgress(Math.floor(event.currentTarget.currentTime))}
        onLoadedMetadata={(event) => setTotal(Math.floor(event.currentTarget.duration))}
        {...(src && { src: `file:///${encodePath(src)}` })}
      />
      <div data-controls className={clsx(styles.container, fullscreen && styles.fullscreen)}>
        <div>
          <TrackCover />
          <div className={styles.buttons}>
            <button type="button" onClick={prevTrack}>
              <SkipPreviousIcon />
            </button>
            <button type="button" onClick={nextTrack}>
              <SkipNextIcon />
            </button>
            <button
              type="button"
              disabled={!src}
              onClick={() => {
                if (element) {
                  if (playing) {
                    element.pause();
                  } else {
                    element.play();
                  }
                }
              }}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>
        </div>
        <Progress />
        <Volume />
      </div>
    </>
  );
};
