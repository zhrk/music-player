import { splitAt } from 'remeda';
import { useFilesStore } from '../../stores/files';
import { usePlayerStore } from '../../stores/player';
import styles from './styles.module.scss';

export const TrackInfo = () => {
  const { src } = usePlayerStore((state) => ({ src: state.src }));
  const { rootPath } = useFilesStore((state) => ({ rootPath: state.rootPath }));

  if (!rootPath) return null;

  const path = (rootPath && src?.replace(`${rootPath}\\`, '')) || '';

  const parts = path?.split('\\');

  const [other, name] = splitAt(parts, parts.length - 1);

  return (
    <div className={styles.container}>
      <span>
        {name
          .join('')
          .replace('.mp3', '')
          .replace(/\[.*?\]/g, '')}
      </span>
      <span>{other.join(' - ')}</span>
    </div>
  );
};
