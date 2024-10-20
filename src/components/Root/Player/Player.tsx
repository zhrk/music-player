/* eslint-disable jsx-a11y/media-has-caption */

import { useState, useCallback } from 'react';
import encodePath from '../../../utils/encodePath';
import { Track } from '../Track';
import { Volume } from '../Volume';
import { useFiles } from './hooks';
import { PlayerProvider } from './PlayerContext';
import styles from './styles.module.scss';
import { Element, Playing, Src } from './types';

export const Player = () => {
  const { files } = useFiles();

  const [src, setSrc] = useState<Src>(null);
  const [playing, setPlaying] = useState<Playing>(false);

  const [element, setElement] = useState<Element>(null);

  const callbackRef = useCallback((node: HTMLAudioElement) => {
    if (node) setElement(node);
  }, []);

  return (
    <PlayerProvider element={element} playing={playing} src={src} setSrc={setSrc}>
      <audio
        ref={callbackRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onCanPlay={(event) => event.currentTarget.play()}
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
              if (playing) {
                element?.pause();
              } else {
                element?.play();
              }
            }}
          >
            {playing ? '⏸️' : '▶️'}
          </button>
          <button type="button">⏮️</button>
          <button type="button">⏭️</button>
          {src}
          <Volume />
        </div>
      </div>
    </PlayerProvider>
  );
};
