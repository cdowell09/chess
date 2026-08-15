import { useState, useCallback, useEffect } from 'react';
import { StartScreen } from './components/StartScreen';
import { GameSetup } from './components/GameSetup';
import { ChessGame } from './components/ChessGame';
import { GameOverModal } from './components/GameOverModal';
import './App.css';

function App() {
  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // App state: 'start', 'setup', 'playing'
  const [screen, setScreen] = useState('start');
  const [gameMode, setGameMode] = useState(null); // 'computer' or 'friend'
  const [gameSettings, setGameSettings] = useState({
    playerColor: 'w',
    difficulty: 3,
  });
  const [gameResult, setGameResult] = useState(null);
  const [gameKey, setGameKey] = useState(0); // Used to reset game component

  // Handle mode selection from start screen
  const handleSelectMode = useCallback((mode) => {
    setGameMode(mode);
    if (mode === 'computer') {
      setScreen('setup');
    } else {
      // Friend mode - go straight to game
      setScreen('playing');
    }
  }, []);

  // Handle game setup completion
  const handleStartGame = useCallback((settings) => {
    setGameSettings(settings);
    setScreen('playing');
  }, []);

  // Handle going back
  const handleBack = useCallback(() => {
    if (screen === 'setup') {
      setScreen('start');
    } else if (screen === 'playing') {
      setScreen('start');
      setGameResult(null);
    }
  }, [screen]);

  // Handle game over
  const handleGameOver = useCallback((result) => {
    setGameResult(result);
  }, []);

  // Handle play again (same settings)
  const handlePlayAgain = useCallback(() => {
    setGameResult(null);
    setGameKey(prev => prev + 1); // Force remount of ChessGame
  }, []);

  // Handle back to main menu
  const handleBackToMenu = useCallback(() => {
    setGameResult(null);
    setScreen('start');
  }, []);

  const handleOpenSetup = useCallback(() => {
    setGameMode('computer');
    setGameResult(null);
    setScreen('setup');
  }, []);

  const isStartScreen = screen === 'start';
  const isSetupScreen = screen === 'setup';

  return (
    <div className={`app app--${screen}`}>
      <header className="site-header">
        <div className="brand" aria-label="Kids Chess">
          <span className="brand-icon" aria-hidden="true">♞</span>
          <span className="brand-lockup">
            <span className="brand-text">Kids Chess</span>
            <span className="brand-note">No ads. Just chess.</span>
          </span>
        </div>
        <nav className="site-nav" aria-label="Primary navigation">
          {screen !== 'playing' && (
            <>
              <button
                className={`nav-link ${isStartScreen ? 'active' : ''}`}
                onClick={handleBackToMenu}
                aria-current={isStartScreen ? 'page' : undefined}
              >
                Main Menu
              </button>
              <button
                className={`nav-link ${isSetupScreen ? 'active' : ''}`}
                onClick={handleOpenSetup}
                aria-current={isSetupScreen ? 'page' : undefined}
              >
                Setup
              </button>
            </>
          )}
          <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            <span aria-hidden="true">{darkMode ? '☼' : '☾'}</span>
            <span className="theme-label">{darkMode ? 'Light' : 'Dark'}</span>
          </button>
        </nav>
      </header>

      <main className={`page page--${screen}`}>
        {screen === 'start' && (
          <StartScreen onSelectMode={handleSelectMode} />
        )}

        {screen === 'setup' && (
          <GameSetup onStart={handleStartGame} onBack={handleBack} />
        )}

        {screen === 'playing' && (
          <>
            <div className="game-layer">
              <ChessGame
                key={gameKey}
                mode={gameMode}
                playerColor={gameSettings.playerColor}
                difficulty={gameSettings.difficulty}
                onGameOver={handleGameOver}
                onBack={handleBack}
              />
            </div>
            {gameResult && (
              <GameOverModal
                result={gameResult}
                playerColor={gameSettings.playerColor}
                mode={gameMode}
                onPlayAgain={handlePlayAgain}
                onBackToMenu={handleBackToMenu}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
