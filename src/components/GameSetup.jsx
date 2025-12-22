import { useState } from 'react';
import './GameSetup.css';

const STORAGE_KEY = 'kidsChessSettings';

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  return { playerColor: 'w', difficulty: 3 };
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
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

export function GameSetup({ onStart, onBack }) {
  const savedSettings = loadSettings();
  const [playerColor, setPlayerColor] = useState(savedSettings.playerColor);
  const [difficulty, setDifficulty] = useState(savedSettings.difficulty);

  const handleStart = () => {
    const settings = { playerColor, difficulty };
    saveSettings(settings);
    onStart(settings);
  };

  return (
    <div className="game-setup">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <h1 className="setup-title">Game Setup</h1>
      <p className="setup-subtitle">Choose your color and difficulty, then start.</p>

      <div className="setup-section">
        <h2>Choose Your Color</h2>
        <div className="color-buttons">
          <button
            className={`color-button white-button ${playerColor === 'w' ? 'selected' : ''}`}
            onClick={() => setPlayerColor('w')}
          >
            <div className="piece-preview white-piece">♔</div>
            <span>White</span>
            <span className="color-hint">(Goes First)</span>
          </button>
          <button
            className={`color-button black-button ${playerColor === 'b' ? 'selected' : ''}`}
            onClick={() => setPlayerColor('b')}
          >
            <div className="piece-preview black-piece">♚</div>
            <span>Black</span>
            <span className="color-hint">(Goes Second)</span>
          </button>
        </div>
      </div>

      <div className="setup-section">
        <h2>Difficulty: {difficulty}</h2>
        <div className="difficulty-labels">
          <span>Easy</span>
          <span>Hard</span>
        </div>
        <div className="difficulty-buttons">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              className={`difficulty-btn ${n === difficulty ? 'selected' : ''}`}
              onClick={() => setDifficulty(n)}
              style={{
                '--btn-color': difficultyColors[n - 1],
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button className="start-button" onClick={handleStart}>
        Start Game!
      </button>
    </div>
  );
}
