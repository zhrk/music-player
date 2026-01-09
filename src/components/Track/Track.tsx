import { useStoreWithEqualityFn } from 'zustand/traditional';
import usePrevious from '../../hooks/usePrevious';
import { usePlayerStore } from '../../stores/player';
import Files from '../../types/files';
import { beautifyTrackName } from '../../utils/beautifyTrackName';
import styles from './styles.module.scss';

export const Track = (props: { data: Files['files'][number] }) => {
  const { data } = props;

  const { name, type, path, children } = data;

  const element = usePlayerStore((state) => state.element);
  const setSrc = usePlayerStore((state) => state.setSrc);
  const addToQueue = usePlayerStore((state) => state.addToQueue);

  const src = useStoreWithEqualityFn(
    usePlayerStore,
    (state) => state.src,
    (prev, next) => !(path === prev || path === next)
  );

  const playing = useStoreWithEqualityFn(
    usePlayerStore,
    (state) => state.playing,
    () => path !== src
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
              if (element) {
                if (playing) {
                  element.pause();
                } else {
                  element.play();
                }
              }
            } else {
              setSrc(path);
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
