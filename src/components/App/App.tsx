import { Controls } from '../Controls';
import { TitleBar } from '../TitleBar';
import { TrackList } from '../TrackList';
import styles from './styles.module.scss';

export const App = () => (
  <>
    <TitleBar />
    <div className={styles.container}>
      <TrackList />
      <Controls />
    </div>
  </>
);
