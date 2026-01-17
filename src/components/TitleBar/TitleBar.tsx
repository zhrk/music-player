import { usePlayerStore } from '../../stores/player';
import styles from './styles.module.scss';

export const TitleBar = () => {
  let queue = usePlayerStore((state) => state.queue);
  const prev = usePlayerStore((state) => state.prev);
  const clearQueue = usePlayerStore((state) => state.clearQueue);

  queue = prev ? queue.slice(prev) : [];

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        {queue.length > 0 && (
          <button type="button" onClick={clearQueue}>
            {`Queue (${queue.length})`}
          </button>
        )}
      </div>
      <div>
        <button
          type="button"
          className={styles.minimize}
          onClick={() => window.electron.app.minimize()}
        >
          <div />
        </button>
        <button
          type="button"
          className={styles.maximize}
          onClick={() => window.electron.app.maximize()}
        >
          <div />
        </button>
        <button type="button" className={styles.close} onClick={() => window.electron.app.close()}>
          <div />
          <div />
        </button>
      </div>
    </div>
  );
};
