import styles from "./App.module.css";

function App() {
  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Punch</h1>
      <p className={styles.tagline} data-testid="placeholder-tagline">
        Scaffold ready. PUNCH-1 will build the game shell here.
      </p>
    </main>
  );
}

export default App;
