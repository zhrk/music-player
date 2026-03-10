import { clsx } from 'clsx';
import { splitAt } from 'remeda';
import { useFilesStore } from '../../stores/files';
import { usePlayerStore } from '../../stores/player';
import { beautifyTrackName } from '../../utils/beautifyTrackName';
import styles from './styles.module.scss';

interface Props {
  fullscreen?: boolean;
}

export const TrackInfo = (props: Props) => {
  const { fullscreen } = props;

  const src = usePlayerStore((state) => state.src);
  const rootPath = useFilesStore((state) => state.rootPath);

  if (!rootPath) return null;

  const path = (rootPath && src?.replace(`${rootPath}\\`, '')) || '';

  const parts = path?.split('\\');

  const [rawOther, rawName] = splitAt(parts, parts.length - 1);

  const name = beautifyTrackName(rawName.join(''));
  const other = rawOther.join(' - ');

  return (
    <div className={clsx(styles.container, fullscreen && styles.fullscreen)}>
      <span title={name}>{name}</span>
      <span title={other}>{other}</span>
    </div>
  );
};
