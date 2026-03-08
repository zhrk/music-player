import { clsx } from 'clsx';
import { usePlayerStore } from '../../stores/player';
import styles from './styles.module.scss';

const normalize = (value: number) => Math.round(value * 100) / 100;

const min = 0;
const max = 1;
const step = 0.01;
const wheelStep = 5;

interface Props {
  fullscreen?: boolean;
}

export const Volume = (props: Props) => {
  const { fullscreen } = props;

  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);

  return (
    <div className={clsx(styles.container, fullscreen && styles.fullscreen)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={volume}
        className={clsx(styles.volume, fullscreen && styles.fullscreen)}
        onChange={(event) => {
          const value = Number(event.target.value);

          setVolume(value);
        }}
        onWheel={(event) => {
          const direction = event.deltaY < 0 ? 1 : -1;

          const raw = volume + direction * step * wheelStep;
          const clamped = Math.min(Math.max(raw, min), max);
          const value = normalize(clamped);

          setVolume(value);
        }}
      />
      <div className={clsx(styles.value, fullscreen && styles.fullscreen)}>
        {normalize(volume * 100)}
      </div>
    </div>
  );
};
