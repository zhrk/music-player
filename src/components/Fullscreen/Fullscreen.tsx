import { useState } from 'react';
import { usePlayerStore } from '../../stores/player';
import { getAverageColor } from '../../utils/getAverageColor';
import styles from './styles.module.scss';

export const Fullscreen = () => {
  const { src } = usePlayerStore((state) => ({ src: state.src }));

  const [color, setColor] = useState<string | null>(null);

  if (!src) return null;

  return (
    <div className={styles.container} {...(color && { style: { backgroundColor: color } })}>
      <div>
        <img
          alt=""
          src={`http://localhost:4445/cover/${encodeURIComponent(src)}`}
          onLoad={(e) => {
            const averageColor = getAverageColor(e.currentTarget);

            if (averageColor) {
              setColor(averageColor);
              window.electron.setColor(averageColor);
            }
          }}
        />
      </div>
    </div>
  );
};
