import { useState } from 'react';
import './GameSetup.css';

const STORAGE_KEY = 'kidsChessSettings';

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore localStorage errors
  }
  return { playerColor: 'w', difficulty: 3 };
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore localStorage errors
  }
}

// Green to orange to red gradient colors for difficulty levels 1-10
const difficultyColors = [
  '#4fa88b', // 1 - green
  '#6ca17f', // 2
  '#899b73', // 3
  '#a69466', // 4
  '#c38d5a', // 5
  '#d18452', // 6
  '#cf784f', // 7
  '#ce6d4b', // 8
  '#cc6148', // 9
  '#ca5544', // 10 - red
];

function getDifficultyLabel(level) {
  if (level <= 2) return 'Just learning';
  if (level <= 4) return 'Friendly';
  if (level <= 6) return 'Tricky';
  if (level <= 8) return 'Tough';
  return 'Club champion';
}

export function GameSetup({ onStart, onBack }) {
  const savedSettings = loadSettings();
  const [playerColor, setPlayerColor] = useState(savedSettings.playerColor);
  const [difficulty, setDifficulty] = useState(savedSettings.difficulty);
  const difficultyLabel = getDifficultyLabel(difficulty);
  const colorLabel = playerColor === 'w' ? 'White' : 'Black';

  const handleStart = () => {
    const settings = { playerColor, difficulty };
    saveSettings(settings);
    onStart(settings);
  };

  return (
    <section className="game-setup" aria-labelledby="setup-title">
      <div className="setup-topbar">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <span className="setup-progress">Your match card</span>
      </div>

      <div className="setup-intro">
        <span className="screen-kicker">Set the table</span>
        <h1 className="setup-title screen-title" id="setup-title">Game Setup</h1>
        <p className="setup-subtitle">Choose your color and difficulty, then start.</p>
      </div>

      <div className="setup-card">
        <fieldset className="setup-section">
          <legend className="setup-legend">
            <span className="legend-kicker">Your pieces</span>
            <span className="legend-title">Choose Your Color</span>
          </legend>

        <div className="color-buttons">
          <button
            className={`color-button white-button ${playerColor === 'w' ? 'selected' : ''}`}
            onClick={() => setPlayerColor('w')}
            aria-pressed={playerColor === 'w'}
            aria-label="Play as White, goes first"
          >
            <span className="selection-check" aria-hidden="true">✓</span>
            <span className="piece-preview white-piece" aria-hidden="true">♔</span>
            <span className="color-name">White</span>
            <span className="color-hint">Goes first</span>
          </button>
          <button
            className={`color-button black-button ${playerColor === 'b' ? 'selected' : ''}`}
            onClick={() => setPlayerColor('b')}
            aria-pressed={playerColor === 'b'}
            aria-label="Play as Black, goes second"
          >
            <span className="selection-check" aria-hidden="true">✓</span>
            <span className="piece-preview black-piece" aria-hidden="true">♚</span>
            <span className="color-name">Black</span>
            <span className="color-hint">Goes second</span>
          </button>
        </div>
        </fieldset>

        <div className="setup-divider" aria-hidden="true" />

        <fieldset className="setup-section">
          <legend className="setup-legend">
            <span className="legend-kicker">Computer strength</span>
            <span className="legend-title">Choose Your Difficulty</span>
          </legend>

          <div className="difficulty-current" aria-live="polite">
            <strong>{difficulty}</strong>
            <span>{difficultyLabel}</span>
          </div>

          <div className="difficulty-scale">
            <span>Easy</span>
            <span>Hard</span>
          </div>

          <div className="difficulty-buttons" aria-label="Difficulty level">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                className={`difficulty-btn ${n === difficulty ? 'selected' : ''}`}
                onClick={() => setDifficulty(n)}
                style={{
                  '--btn-color': difficultyColors[n - 1],
                }}
                aria-pressed={n === difficulty}
                aria-label={`Difficulty ${n}: ${getDifficultyLabel(n)}`}
              >
                {n}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="setup-footer">
          <div className="setup-summary" aria-live="polite">
            <span>Your match</span>
            <strong>{colorLabel} <span aria-hidden="true">·</span> Level {difficulty}</strong>
          </div>
          <button className="start-button" onClick={handleStart}>
            <span>Start Game!</span>
            <span className="start-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
