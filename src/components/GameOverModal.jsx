import { useEffect } from 'react';
import { playSound } from '../utils/sounds';
import { UnicornFlyby } from './UnicornFlyby';
import './GameOverModal.css';

export function GameOverModal({ result, playerColor, mode, onPlayAgain, onBackToMenu }) {
  // Determine if the player won (in computer mode)
  const playerWon = mode === 'computer' && result === (playerColor === 'w' ? 'white' : 'black');
  const playerLost = mode === 'computer' && result !== 'draw' && !playerWon;

  // Play celebration sound when modal appears
  useEffect(() => {
    if (playerWon) {
      playSound('win');
    }
  }, [playerWon]);

  let title, message, emoji;

  if (result === 'draw') {
    title = "It's a Draw!";
    message = "Great game! Nobody wins this time.";
    emoji = "🤝";
  } else if (mode === 'friend') {
    title = `${result === 'white' ? 'White' : 'Black'} Wins!`;
    message = "Great game, both of you!";
    emoji = "🎉";
  } else if (playerWon) {
    title = "You Win!";
    message = "Amazing! You beat the computer!";
    emoji = "🏆";
  } else {
    title = "Game Over";
    message = "The computer wins this time. Try again!";
    emoji = "🤖";
  }

  return (
    <div className="modal-overlay">
      {playerWon && <UnicornFlyby />}
      <div className={`game-over-modal ${playerWon ? 'winner' : ''}`}>
        <div className="celebration-emoji">{emoji}</div>
        <h1 className="modal-title">{title}</h1>
        <p className="modal-message">{message}</p>

        <div className="modal-buttons">
          <button className="modal-button play-again" onClick={onPlayAgain}>
            🔄 Play Again
          </button>
          <button className="modal-button back-menu" onClick={onBackToMenu}>
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
