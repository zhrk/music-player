import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { useAppStore } from '../../stores/app';
import { usePlayerStore } from '../../stores/player';
import { Fullscreen } from '../Fullscreen';
import styles from './styles.module.scss';

export const TrackCover = () => {
  const { src } = usePlayerStore((state) => ({ src: state.src }));

  const { fullscreen, setFullscreen } = useAppStore((state) => ({
    fullscreen: state.fullscreen,
    setFullscreen: state.setFullscreen,
  }));

  return (
    <>
      {fullscreen && createPortal(<Fullscreen />, document.body)}
      <button
        type="button"
        className={clsx(styles.container, fullscreen && styles.fullscreen)}
        onClick={() => setFullscreen(!fullscreen)}
      >
        {src &&
          (!fullscreen ? (
            <img alt="" src={`http://localhost:4445/cover/${encodeURIComponent(src)}`} />
          ) : (
            'x'
          ))}
      </button>
    </>
  );
};
