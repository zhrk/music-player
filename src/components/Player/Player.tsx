/* eslint-disable jsx-a11y/media-has-caption */

import { useCallback } from 'react';
import encodePath from '../../utils/encodePath';
import { Progress } from '../Progress';
import { Track } from '../Track';
import { Volume } from '../Volume';
import { useFiles } from './hooks';
import { usePlayerStore } from './store';
import styles from './styles.module.scss';

export const Player = () => {
  const { files } = useFiles();

  const { element, src, playing, setElement, setPlaying, setProgress, setTotal } = usePlayerStore(
    (state) => ({
      element: state.element,
      src: state.src,
      playing: state.playing,
      setElement: state.setElement,
      setPlaying: state.setPlaying,
      setProgress: state.setProgress,
      setTotal: state.setTotal,
    })
  );

  const callbackRef = useCallback(
    (node: HTMLAudioElement) => {
      if (node) setElement(node);
    },
    [setElement]
  );

  // https://www.electronjs.org/docs/latest/api/corner-smoothing-css

  return (
    <>
      <audio
        ref={callbackRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onCanPlay={(event) => event.currentTarget.play()}
        onTimeUpdate={(event) => setProgress(Math.floor(event.currentTarget.currentTime))}
        onLoadedMetadata={(event) => setTotal(Math.floor(event.currentTarget.duration))}
        {...(src && { src: `file:///${encodePath(src)}` })}
      />
      <div className={styles.container}>
        <div className={styles.tree}>
          {/* {JSON.stringify(files, null, 2)} */}
          {files.map((item) => (
            <Track key={item.name} data={item} />
          ))}
        </div>
        <div className={styles.controls}>
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
            {playing ? '⏸️' : '▶️'}
          </button>
          <button type="button">⏮️</button>
          <button type="button">⏭️</button>
          <Volume />
          <Progress />
          &nbsp; &nbsp;
          {src}
        </div>
      </div>
    </>
  );
};
