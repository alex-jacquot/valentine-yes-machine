"use client";

import { useState } from "react";
import { GAME_SCREENS } from "./screens";
import { WinScreen } from "./screens/WinScreen";
import { EndWinScreen } from "./screens/EndWinScreen";

type GameId = number;
type ScreenId = GameId | "yesWin" | "endWin";

const GAME_COUNT = GAME_SCREENS.length;
const NO_WORDS = ["No", "Nuh-uh", "Nope", "Nah", "Not today", "Ewwww", "Negative", "Non", "Niet"];

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(0);
  const [lastGameScreen, setLastGameScreen] = useState<GameId>(0);
  const [noOverlayText, setNoOverlayText] = useState<string | null>(null);
  const [isNoOverlayVisible, setIsNoOverlayVisible] = useState(false);

  const goToWinFrom = (from: GameId) => {
    setLastGameScreen(from);
    setCurrentScreen("yesWin");
  };

  const triggerNoFrom = (from: GameId) => {
    const isLast = from >= GAME_COUNT - 1;

    const choice =
      NO_WORDS[Math.floor(Math.random() * NO_WORDS.length)] ?? "No";
    setNoOverlayText(choice);
    setIsNoOverlayVisible(true);

    setTimeout(() => {
      setIsNoOverlayVisible(false);
      setNoOverlayText(null);
      if (isLast) {
        setCurrentScreen("endWin");
      } else {
        setCurrentScreen(from + 1);
      }
    }, 1000);
  };

  const handleRestart = () => {
    setCurrentScreen(0);
  };

  const handleBackToPrevious = () => {
    setCurrentScreen(lastGameScreen);
  };

  return (
    <main className="page-root">
      <div className="background-glow" />
      <div className="screen-container">
        {typeof currentScreen === "number" && GAME_SCREENS[currentScreen] && (
          (() => {
            const ScreenComponent = GAME_SCREENS[currentScreen]!;
            return (
              <ScreenComponent
                onYes={() => goToWinFrom(currentScreen)}
                onNo={() => triggerNoFrom(currentScreen)}
              />
            );
          })()
        )}

        {currentScreen === "yesWin" && (
          <WinScreen
            onRestart={handleRestart}
            onBackToPrevious={handleBackToPrevious}
          />
        )}

        {currentScreen === "endWin" && (
          <EndWinScreen onRestart={handleRestart} />
        )}

        {isNoOverlayVisible && noOverlayText && (
          <div className="no-overlay">
            <span className="no-overlay-text">{noOverlayText}</span>
          </div>
        )}
      </div>
    </main>
  );
}

