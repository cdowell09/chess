import { useEffect, useRef } from 'react';
import './GameOverModal.css';
import './UnicornFlyby.css';

export function GameOverModal({ result, playerColor, mode, onPlayAgain, onBackToMenu }) {
  const playerWon = mode === 'computer' && result === (playerColor === 'w' ? 'white' : 'black');
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
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

  return (
    <dialog
      className={`game-over-modal game-over-modal--${outcome}`}
      ref={dialogRef}
      aria-labelledby="game-over-title"
      aria-describedby="game-over-message"
      onCancel={(event) => {
        event.preventDefault();
        onBackToMenu();
      }}
    >
      {playerWon && (
        <div className="unicorn-flyby" aria-hidden="true">
          <div className="unicorn-rainbow" />
          <div className="unicorn-emoji">🦄</div>
        </div>
      )}
      <div className="result-seal" aria-hidden="true">
        <span>{emoji}</span>
      </div>
      <span className="modal-kicker">Game complete</span>
      <h1 className="modal-title" id="game-over-title">{title}</h1>
      <p className="modal-message" id="game-over-message">{message}</p>

      <div className="modal-buttons">
        <button
          className="modal-button play-again"
          autoFocus
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
    </dialog>
  );
}
