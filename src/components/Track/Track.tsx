import Files from '../../types/files';
import { usePlayerStore } from '../Player/store';
import styles from './styles.module.scss';

const Track = (props: { data: Files['files'][number] }) => {
  const { data } = props;

  const { name, type, path, children } = data;

  const { element, src, playing, setSrc } = usePlayerStore((state) => ({
    element: state.element,
    src: state.src,
    playing: state.playing,
    setSrc: state.setSrc,
  }));

  return (
    <div className={styles.container}>
      {type === 'file' ? (
        <button
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

export { Track };
