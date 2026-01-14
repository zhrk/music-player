import clsx from 'clsx';
import { useState } from 'react';
import IconMaximize from '../../static/icons/maximize.svg';
import { usePlayerStore } from '../../stores/player';
import { getAverageColor } from '../../utils/getAverageColor';
import styles from './styles.module.scss';

export const Fullscreen = () => {
  const { src } = usePlayerStore((state) => ({ src: state.src }));

  const [maximized, setMaximized] = useState(false);
  const [color, setColor] = useState<string | null>(null);

  if (!src) return null;

  return (
    <div
      className={clsx(styles.container, maximized && styles.maximized)}
      {...(color && { style: { backgroundColor: color } })}
    >
      <div className={styles.cover}>
        <button type="button" onClick={() => setMaximized((prev) => !prev)}>
          <IconMaximize />
        </button>
        <img
          alt=""
          src={`http://localhost:4445/cover?src=${encodeURIComponent(src)}`}
          onLoad={(e) => {
            const averageColor = getAverageColor(e.currentTarget);

            if (averageColor) setColor(averageColor);
          }}
        />
      </div>
    </div>
  );
};
