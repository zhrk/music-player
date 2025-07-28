import { usePlayerStore } from '../../stores/player';
import styles from './styles.module.scss';

const normalize = (value: number) => Math.round(value * 100) / 100;

const min = 0;
const max = 1;
const step = 0.01;
const wheelStep = 5;

export const Volume = () => {
  const { volume, setVolume, element } = usePlayerStore((state) => ({
    volume: state.volume,
    setVolume: state.setVolume,
    element: state.element,
  }));

  return (
    <div className={styles.container}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={volume}
        className={styles.volume}
        onChange={(event) => {
          const value = Number(event.target.value);

          setVolume(value);

          if (element) element.volume = value;
        }}
        onWheel={(event) => {
          const direction = event.deltaY < 0 ? 1 : -1;

          const raw = volume + direction * step * wheelStep;
          const clamped = Math.min(Math.max(raw, min), max);
          const value = normalize(clamped);

          setVolume(value);

          if (element) element.volume = value;
        }}
      />
      <div className={styles.value}>{normalize(volume * 100)}</div>
    </div>
  );
};
