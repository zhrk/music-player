import { useFilesStore } from '../../stores/files';
import { usePlayerStore } from '../../stores/player';
import styles from './styles.module.scss';

export const TitleBar = () => {
  const { src } = usePlayerStore((state) => ({ src: state.src }));
  const { rootPath } = useFilesStore((state) => ({ rootPath: state.rootPath }));

  return (
    <div className={styles.container}>
      {src?.replace(`${rootPath}\\`, '').replaceAll('\\', ' - ')}
    </div>
  );
};
