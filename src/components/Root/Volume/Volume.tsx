import { useEffect, useState } from 'react';
import { usePlayerContext } from '../Player/PlayerContext';

const DEFAULT_VOLUME = 0.01;

export const Volume = () => {
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  const { element } = usePlayerContext();

  useEffect(() => {
    if (element) {
      element.volume = DEFAULT_VOLUME;
    }
  }, [element]);

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
