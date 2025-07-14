import { usePlayerStore } from '../Player/store';
import styles from './styles.module.scss';

function formatDuration(seconds: number) {
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const s = remainingSeconds < 10 ? `0${remainingSeconds}` : String(remainingSeconds);

  return `${minutes}:${s}`;
}

export const Progress = () => {
  const { progress, total, element } = usePlayerStore((state) => ({
    progress: state.progress,
    total: state.total,
    element: state.element,
  }));

  return (
    <div className={styles.container}>
      <input
        type="range"
        min={0}
        max={total}
        step={1}
        value={progress}
        className={styles.progress}
        onChange={(event) => {
          if (element) {
            element.currentTime = Number(event.target.value);
          }
        }}
      />
      {`${formatDuration(progress)} / ${formatDuration(total)}`}
    </div>
  );
};
