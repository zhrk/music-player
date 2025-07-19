import { useCallback } from 'react';
import PauseIcon from '../../static/icons/pause.svg';
import PlayIcon from '../../static/icons/play.svg';
import SkipNextIcon from '../../static/icons/skip-next.svg';
import SkipPreviousIcon from '../../static/icons/skip-previous.svg';
import { useFilesStore } from '../../stores/files';
import { usePlayerStore } from '../../stores/player';
import encodePath from '../../utils/encodePath';
import { Progress } from '../Progress';
import { Volume } from '../Volume';
import styles from './styles.module.scss';

export const Controls = () => {
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

  const nextTrack = () => setSrc(flatFiles[Math.floor(Math.random() * flatFiles.length)].path);

  return (
    <>
      <audio
        ref={callbackRef}
        onEnded={() => nextTrack()}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onCanPlay={(event) => event.currentTarget.play()}
        onTimeUpdate={(event) => setProgress(Math.floor(event.currentTarget.currentTime))}
        onLoadedMetadata={(event) => setTotal(Math.floor(event.currentTarget.duration))}
        {...(src && { src: `file:///${encodePath(src)}` })}
      />
      <div className={styles.container}>
        <div>
          <div className={styles.cover}>
            {src && <img alt="" src={`http://localhost:4445/cover/${encodeURIComponent(src)}`} />}
          </div>
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
