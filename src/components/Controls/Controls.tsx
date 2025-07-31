import clsx from 'clsx';
import { useCallback } from 'react';
import usePrevious from '../../hooks/usePrevious';
import PauseIcon from '../../static/icons/pause.svg';
import PlayIcon from '../../static/icons/play.svg';
import SkipNextIcon from '../../static/icons/skip-next.svg';
import SkipPreviousIcon from '../../static/icons/skip-previous.svg';
import { useAppStore } from '../../stores/app';
import { useFilesStore } from '../../stores/files';
import { usePlayerStore } from '../../stores/player';
import { usePlaylistStore } from '../../stores/playlist';
import encodePath from '../../utils/encodePath';
import { Progress } from '../Progress';
import { TrackCover } from '../TrackCover';
import { Volume } from '../Volume';
import styles from './styles.module.scss';

export const Controls = () => {
  const { played } = usePlaylistStore((state) => ({ played: state.played }));
  const { fullscreen } = useAppStore((state) => ({ fullscreen: state.fullscreen }));
  const { flatFiles } = useFilesStore((state) => ({ flatFiles: state.flatFiles }));

  const { src, element, playing, setPlaying, setElement, setProgress, setTotal, setSrc } =
    usePlayerStore((state) => ({
      element: state.element,
      src: state.src,
      playing: state.playing,
      setElement: state.setElement,
      setSrc: state.setSrc,
      setPlaying: state.setPlaying,
      setProgress: state.setProgress,
      setTotal: state.setTotal,
    }));

  const callbackRef = useCallback(
    (node: HTMLAudioElement) => {
      if (node) setElement(node);
    },
    [setElement]
  );

  const prevSrc = usePrevious(src);

  const nextTrack = () => {
    const randomTrack = flatFiles[Math.floor(Math.random() * flatFiles.length)].path;

    if (played.includes(randomTrack)) {
      nextTrack();
    } else {
      setSrc(randomTrack);
    }
  };

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
            <button type="button">
              <SkipPreviousIcon />
            </button>
            <button type="button" onClick={() => nextTrack()}>
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
