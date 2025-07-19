import { useFilesStore } from '../../stores/files';
import { Track } from '../Track';
import styles from './styles.module.scss';

export const TrackList = () => {
  const { files } = useFilesStore((state) => ({ files: state.files }));

  return (
    <div className={styles.container}>
      {files.map((item) => (
        <Track key={item.name} data={item} />
      ))}
    </div>
  );
};
