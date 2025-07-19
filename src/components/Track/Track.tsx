import usePrevious from '../../hooks/usePrevious';
import { usePlayerStore } from '../../stores/player';
import Files from '../../types/files';
import styles from './styles.module.scss';

export const Track = (props: { data: Files['files'][number] }) => {
  const { data } = props;

  const { name, type, path, children } = data;

  const { element, src, playing, setSrc } = usePlayerStore((state) => ({
    element: state.element,
    src: state.src,
    playing: state.playing,
    setSrc: state.setSrc,
  }));

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
          {name}
        </button>
      ) : (
        name
      )}
      {type === 'file' ? null : children.map((item) => <Track key={item.name} data={item} />)}
    </div>
  );
};
