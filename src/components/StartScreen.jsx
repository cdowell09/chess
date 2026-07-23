import './StartScreen.css';

export function StartScreen({ onSelectMode }) {
  return (
    <section className="start-screen" aria-labelledby="welcome-title">
      <div className="welcome-panel">
        <div className="hero">
          <span className="eyebrow">No Ads. Just Chess.</span>
          <h1 className="title" id="welcome-title">Kids Chess</h1>
          <p className="subtitle">Pick a mode and start playing!</p>

          <div className="hero-facts" aria-label="Game highlights">
            <span className="hero-fact">
              <strong>10</strong>
              <span>computer levels</span>
            </span>
            <span className="hero-fact">
              <strong>2</strong>
              <span>ways to play</span>
            </span>
            <span className="hero-fact">
              <strong aria-hidden="true">✓</strong>
              <span>works offline</span>
            </span>
          </div>
        </div>

        <div className="club-crest" aria-hidden="true">
          <div className="crest-board">
            <span className="crest-knight">♞</span>
          </div>
          <span className="crest-caption">Welcome to the table</span>
        </div>
      </div>

      <div className="mode-section">
        <div className="mode-heading">
          <span>Choose your game</span>
          <h2>Take a seat</h2>
        </div>

        <div className="mode-buttons">
          <button
            className="mode-card mode-card--computer"
            onClick={() => onSelectMode('computer')}
          >
            <span className="mode-card-top">
              <span className="mode-icon" aria-hidden="true">♞</span>
              <span className="mode-chip">10 levels</span>
            </span>
            <span className="mode-label">Play vs Computer</span>
            <span className="mode-description">
              Practice against an AI with adjustable difficulty.
            </span>
            <span className="mode-action">
              Choose your challenge <span aria-hidden="true">→</span>
            </span>
          </button>

          <button
            className="mode-card mode-card--friend"
            onClick={() => onSelectMode('friend')}
          >
            <span className="mode-card-top">
              <span className="mode-icon mode-icon--pair" aria-hidden="true">♙♟</span>
              <span className="mode-chip">Same screen</span>
            </span>
            <span className="mode-label">Play vs Friend</span>
            <span className="mode-description">
              Share the screen and take turns on the same board.
            </span>
            <span className="mode-action">
              Start together <span aria-hidden="true">→</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
