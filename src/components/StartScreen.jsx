import './StartScreen.css';

export function StartScreen({ onSelectMode }) {
  return (
    <div className="start-screen">
      <div className="hero">
        <span className="eyebrow">Welcome</span>
        <h1 className="title">Kids Chess</h1>
        <p className="subtitle">Pick a mode and jump right in.</p>
      </div>

      <div className="mode-buttons">
        <button
          className="mode-card"
          onClick={() => onSelectMode('computer')}
        >
          <div className="mode-card-header">
            <span className="mode-icon" aria-hidden="true">🤖</span>
            <span className="mode-label">Play vs Computer</span>
          </div>
          <span className="mode-description">
            Practice against an AI with adjustable difficulty.
          </span>
        </button>

        <button
          className="mode-card"
          onClick={() => onSelectMode('friend')}
        >
          <div className="mode-card-header">
            <span className="mode-icon" aria-hidden="true">👫</span>
            <span className="mode-label">Play vs Friend</span>
          </div>
          <span className="mode-description">
            Share the screen and take turns on the same board.
          </span>
        </button>
      </div>
    </div>
  );
}
