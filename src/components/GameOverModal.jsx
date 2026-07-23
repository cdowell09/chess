import { useEffect, useRef } from 'react';
import { UnicornFlyby } from './UnicornFlyby';
import './GameOverModal.css';

export function GameOverModal({ result, playerColor, mode, onPlayAgain, onBackToMenu }) {
  const playerWon = mode === 'computer' && result === (playerColor === 'w' ? 'white' : 'black');
  const dialogRef = useRef(null);
  const playAgainRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    playAgainRef.current?.focus();

    return () => {
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, []);

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

  const outcome = result === 'draw'
    ? 'draw'
    : mode === 'friend'
      ? 'friend'
      : playerWon
        ? 'win'
        : 'loss';

  const handleDialogKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onBackToMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = dialogRef.current?.querySelectorAll('button:not(:disabled)');
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="modal-overlay" role="presentation">
      {playerWon && <UnicornFlyby />}
      <div
        className={`game-over-modal game-over-modal--${outcome}`}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-over-title"
        aria-describedby="game-over-message"
        onKeyDown={handleDialogKeyDown}
      >
        <div className="result-seal" aria-hidden="true">
          <span>{emoji}</span>
        </div>
        <span className="modal-kicker">Game complete</span>
        <h1 className="modal-title" id="game-over-title">{title}</h1>
        <p className="modal-message" id="game-over-message">{message}</p>

        <div className="modal-buttons">
          <button
            className="modal-button play-again"
            ref={playAgainRef}
            onClick={onPlayAgain}
          >
            <span>Play Again</span>
            <span aria-hidden="true">↻</span>
          </button>
          <button className="modal-button back-menu" onClick={onBackToMenu}>
            <span>Main Menu</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
