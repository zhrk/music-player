import styles from './styles.module.scss';

export const TitleBar = () => (
  <div className={styles.container}>
    <div className={styles.drag} />
    <div className={styles.controls}>
      <button type="button" className={styles.minimize}>
        <div />
      </button>
      <button type="button" className={styles.maximize}>
        <div />
      </button>
      <button type="button" className={styles.close}>
        <div />
        <div />
      </button>
    </div>
  </div>
);
