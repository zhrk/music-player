import styles from './styles.module.scss';

export const Find = () => (
  <input
    type="text"
    autoFocus
    className={styles.find}
    onChange={(event) => window.electron.app.find(event.currentTarget.value)}
    onKeyDown={(event) => {
      if (event.key === 'Enter') {
        window.electron.app.find(event.currentTarget.value, !event.shiftKey);
      }

      if (event.key === 'Escape') {
        event.currentTarget.value = '';
      }
    }}
  />
);
