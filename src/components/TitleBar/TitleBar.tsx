import { usePlayerStore } from '../Player/store';
import styles from './styles.module.scss';

export const TitleBar = () => {
  const { src } = usePlayerStore((state) => ({ src: state.src }));

  return <div className={styles.container}>{src}</div>;
};
