import { usePlayerStore } from '../Player/store';

export const Volume = () => {
  const { volume, setVolume, element } = usePlayerStore((state) => ({
    volume: state.volume,
    setVolume: state.setVolume,
    element: state.element,
  }));

  return (
    <>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(event) => {
          const value = Number(event.target.value);

          setVolume(value);

          if (element) element.volume = value;
        }}
      />
      {`${Math.ceil(volume * 100)}%`}
    </>
  );
};
