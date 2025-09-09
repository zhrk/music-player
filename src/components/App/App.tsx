import { Route, Switch } from 'wouter';
import { Controls } from '../Controls';
import { Find } from '../Find';
import { TitleBar } from '../TitleBar';
import { TrackList } from '../TrackList';
import styles from './styles.module.scss';

export const App = () => (
  <Switch>
    <Route path="/">
      <TitleBar />
      <div className={styles.container}>
        <TrackList />
        <Controls />
      </div>
    </Route>
    <Route path="/find">
      <Find />
    </Route>
  </Switch>
);
