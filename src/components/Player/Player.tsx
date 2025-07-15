import { useCallback } from 'react';
import { useFilesStore } from '../../stores/files';
import encodePath from '../../utils/encodePath';
import { Controls } from '../Controls';
import { Track } from '../Track';
import { usePlayerStore } from './store';
import styles from './styles.module.scss';

export const Player = () => {
  const { files, flatFiles } = useFilesStore((state) => ({
    files: state.files,
    flatFiles: state.flatFiles,
  }));

  const { src, setElement, setPlaying, setProgress, setTotal, setSrc } = usePlayerStore(
    (state) => ({
      src: state.src,
      setElement: state.setElement,
      setPlaying: state.setPlaying,
      setProgress: state.setProgress,
      setTotal: state.setTotal,
      setSrc: state.setSrc,
    })
  );

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
        <div className={styles.tree}>
          {files.map((item) => (
            <Track key={item.name} data={item} />
          ))}
        </div>
        <Controls />
      </div>
    </>
  );
};
