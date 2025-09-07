import styles from './styles.module.scss';

export const TitleBar = () => (
  <div className={styles.container}>
    <button
      type="button"
      className={styles.minimize}
      onClick={() => window.electron.app.minimize()}
    >
      <div />
    </button>
    <button
      type="button"
      className={styles.maximize}
      onClick={() => window.electron.app.maximize()}
    >
      <div />
    </button>
    <button type="button" className={styles.close} onClick={() => window.electron.app.close()}>
      <div />
      <div />
    </button>
  </div>
);
