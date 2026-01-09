import { splitAt } from 'remeda';
import { useFilesStore } from '../../stores/files';
import { usePlayerStore } from '../../stores/player';
import { beautifyTrackName } from '../../utils/beautifyTrackName';
import styles from './styles.module.scss';

export const TrackInfo = () => {
  const { src } = usePlayerStore((state) => ({ src: state.src }));
  const { rootPath } = useFilesStore((state) => ({ rootPath: state.rootPath }));

  if (!rootPath) return null;

  const path = (rootPath && src?.replace(`${rootPath}\\`, '')) || '';

  const parts = path?.split('\\');

  const [rawOther, rawName] = splitAt(parts, parts.length - 1);

  const name = beautifyTrackName(rawName.join(''));
  const other = rawOther.join(' - ');

  return (
    <div className={styles.container}>
      <span title={name}>{name}</span>
      <span title={other}>{other}</span>
    </div>
  );
};
