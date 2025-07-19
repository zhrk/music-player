import { usePlayerStore } from '../../stores/player';
import styles from './styles.module.scss';

export const Volume = () => {
  const { volume, setVolume, element } = usePlayerStore((state) => ({
    volume: state.volume,
    setVolume: state.setVolume,
    element: state.element,
  }));

  return (
    <input
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={volume}
      className={styles.volume}
      onChange={(event) => {
        const value = Number(event.target.value);

        setVolume(value);

        if (element) element.volume = value;
      }}
    />
  );
};
