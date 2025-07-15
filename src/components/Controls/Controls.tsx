import PauseIcon from '../../static/icons/pause.svg';
import PlayIcon from '../../static/icons/play.svg';
import SkipNextIcon from '../../static/icons/skip-next.svg';
import SkipPreviousIcon from '../../static/icons/skip-previous.svg';
import { useFilesStore } from '../../stores/files';
import { usePlayerStore } from '../Player/store';
import { Progress } from '../Progress';
import { Volume } from '../Volume';
import styles from './styles.module.scss';

export const Controls = () => {
  const { flatFiles } = useFilesStore((state) => ({ flatFiles: state.flatFiles }));

  const { element, src, playing, setSrc } = usePlayerStore((state) => ({
    element: state.element,
    src: state.src,
    playing: state.playing,
    setSrc: state.setSrc,
  }));

  const nextTrack = () => setSrc(flatFiles[Math.floor(Math.random() * flatFiles.length)].path);

  return (
    <div className={styles.container}>
      <div>
        <div
          key={src}
          className={styles.cover}
          {...(src && {
            style: {
              backgroundImage: `url(http://localhost:4445/cover/${encodeURIComponent(src)})`,
            },
          })}
        />
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
  );
};
