import Files from '../../../types/files';
import { usePlayerContext } from '../Player/PlayerContext';
import styles from './styles.module.scss';

const Track = (props: { data: Files[number] }) => {
  const { data } = props;

  const { name, type, path, children } = data;

  const { src, setSrc, playing, element } = usePlayerContext();

  return (
    <div className={styles.container}>
      {type === 'file' ? (
        <button
          type="button"
          onClick={() => {
            if (path === src) {
              if (playing) {
                element?.pause();
              } else {
                element?.play();
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
