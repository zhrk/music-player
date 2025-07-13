import { usePlayerStore } from '../Player/store';

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
    <>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={progress}
        onChange={(event) => {
          if (element) {
            element.currentTime = Math.floor(element.duration / 100) * Number(event.target.value);
          }
        }}
      />
      {`${formatDuration(progress)} / ${formatDuration(total)}`}
    </>
  );
};
