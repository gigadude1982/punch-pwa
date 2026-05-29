import styles from "./App.module.css";
import PlayButton from "./components/PlayButton";

function App() {
  const handlePlay = () => {
    // Play action handler — wiring to game logic will be added in a future task.
  };

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Punch</h1>
      <p className={styles.tagline} data-testid="placeholder-tagline">
        Scaffold ready. PUNCH-1 will build the game shell here.
      </p>
      <PlayButton onPlay={handlePlay} />
    </main>
  );
}

export default App;
