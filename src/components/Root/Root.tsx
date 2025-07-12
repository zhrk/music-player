import { Player } from '../Player';
import styles from './styles.module.scss';

export const Root = () => (
  <>
    <div className={styles.titleBar} />
    <Player />
  </>
);
