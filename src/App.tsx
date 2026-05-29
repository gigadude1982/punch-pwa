import { Game } from "./components/Game";
import { GameProvider } from "./game/GameProvider";
import styles from "./App.module.css";

function App() {
  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Punch 🦧</h1>
      <GameProvider>
        <Game />
      </GameProvider>
    </main>
  );
}

export default App;
