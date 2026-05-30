import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Landing } from "./components/Landing";
import { Game } from "./components/Game";
import { Footer } from "./components/Footer";
import { GameProvider } from "./game/GameProvider";
import styles from "./App.module.css";

type View = "landing" | "game";

interface AppProps {
  /** Whether the Play button is shown and the game is reachable (dev) vs Coming Soon (prod). */
  enablePlay: boolean;
}

function App({ enablePlay }: AppProps) {
  const [view, setView] = useState<View>("landing");

  return (
    <AnimatePresence mode="wait">
      {view === "landing" ? (
        <motion.div key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <Landing enablePlay={enablePlay} onPlay={() => setView("game")} />
          <Footer />
        </motion.div>
      ) : (
        <motion.main
          key="game"
          className={styles.app}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>Punch 🦧</h1>
          <GameProvider>
            <Game />
          </GameProvider>
          <Footer />
        </motion.main>
      )}
    </AnimatePresence>
  );
}

export default App;
