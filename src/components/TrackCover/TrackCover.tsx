import { FastAverageColor } from 'fast-average-color';
import { useState } from 'react';
import { usePlayerStore } from '../../stores/player';
import styles from './styles.module.scss';

const fac = new FastAverageColor();

export const TrackCover = () => {
  const [color, setColor] = useState<string | null>(null);
  const { src } = usePlayerStore((state) => ({ src: state.src }));

  return (
    <div className={styles.container} {...(color && { style: { backgroundColor: color } })}>
      {src && (
        <img
          alt=""
          src={`http://localhost:4445/cover/${encodeURIComponent(src)}`}
          onLoad={(event) => {
            const { hex } = fac.getColor(event.currentTarget, { algorithm: 'dominant' });

            setColor(hex);
          }}
        />
      )}
    </div>
  );
};
