import { useStoreWithEqualityFn } from 'zustand/traditional';
import usePrevious from '../../hooks/usePrevious';
import { usePlayerStore } from '../../stores/player';
import Files from '../../types/files';
import { beautifyTrackName } from '../../utils/beautifyTrackName';
import styles from './styles.module.scss';

export const Track = (props: { data: Files['files'][number] }) => {
  const { data } = props;

  const { name, type, path, children } = data;

  const addToQueue = usePlayerStore((state) => state.addToQueue);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const playTrack = usePlayerStore((state) => state.playTrack);

  const src = useStoreWithEqualityFn(
    usePlayerStore,
    (state) => state.src,
    (prev, next) => !(path === prev || path === next)
  );

  const prevSrc = usePrevious(src);

  return (
    <div className={styles.container}>
      {type === 'file' ? (
        <button
          ref={(node) => {
            if (node && src !== prevSrc && path === src) {
              node.scrollIntoView({ block: 'center' });
            }
          }}
          {...(path === src && { className: styles.active })}
          type="button"
          onClick={() => {
            if (path === src) {
              togglePlayPause();
            } else {
              playTrack(path);
            }
          }}
        >
          {beautifyTrackName(name)}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            const getFiles = (files: Files['files']): Parameters<typeof addToQueue>[0] =>
              files.flatMap((item) =>
                item.type === 'file' ? [item.path] : getFiles(item.children)
              );

            addToQueue(getFiles(children));
          }}
        >
          {name}
        </button>
      )}
      {type === 'file' ? null : children.map((item) => <Track key={item.name} data={item} />)}
    </div>
  );
};
