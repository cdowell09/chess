import './StartScreen.css';

export function StartScreen({ onSelectMode }) {
  return (
    <div className="start-screen">
      <h1 className="title">Kids Chess</h1>
      <p className="subtitle">Choose how you want to play!</p>

      <div className="mode-buttons">
        <button
          className="mode-button computer-button"
          onClick={() => onSelectMode('computer')}
        >
          <span className="mode-icon">🤖</span>
          <span className="mode-label">Play vs Computer</span>
        </button>

        <button
          className="mode-button friend-button"
          onClick={() => onSelectMode('friend')}
        >
          <span className="mode-icon">👫</span>
          <span className="mode-label">Play vs Friend</span>
        </button>
      </div>
    </div>
  );
}
