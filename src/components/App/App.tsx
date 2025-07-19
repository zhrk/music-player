import { Controls } from '../Controls';
import { TrackList } from '../TrackList';
import styles from './styles.module.scss';

export const App = () => (
  <div className={styles.container}>
    <TrackList />
    <Controls />
  </div>
);
