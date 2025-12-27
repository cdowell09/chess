# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/claude-code) when working with code in this repository.

## Project Overview

Kids Chess is an ad-free chess web app designed for young children (ages 3-7). It features a tablet-first design with tap-tap interaction, a simple AI opponent with adjustable difficulty, and local two-player mode.

## Tech Stack

- **Vite + React** - Build tool and UI framework
- **chess.js** - Chess game logic, move validation, game state
- **react-chessboard v5** - Chess board UI component
- **Howler.js** - Sound effects

## Key Architecture Decisions

### react-chessboard v5 API
All props must be passed via an `options` object:
```jsx
<Chessboard
  options={{
    position: fen,
    onSquareClick: handler,
    // ... all other options
  }}
/>
```

Event handlers receive objects, not primitives:
- `onSquareClick: ({ square, piece }) => void`
- `onPieceClick: ({ square, piece, isSparePiece }) => void`

### AI Opponent
The computer opponent uses a simple evaluation-based AI (not Stockfish) that:
- Evaluates moves based on captures, checks, center control, and piece safety
- Scales difficulty 1-10 by selecting from top N% of evaluated moves
- Level 1-2: Nearly random (beatable by young children)
- Level 10: Picks from top 15% of moves

### Sound Effects
Generated using Web Audio API oscillators (no external audio files required).

## Common Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── components/
│   ├── ChessGame.jsx      # Main game board and controls
│   ├── StartScreen.jsx    # Mode selection (vs Computer / vs Friend)
│   ├── GameSetup.jsx      # Color and difficulty picker
│   └── GameOverModal.jsx  # Win/draw celebration
├── hooks/
│   ├── useChessGame.js    # Chess state management wrapper around chess.js
│   └── useStockfish.js    # AI move generation (misnamed, doesn't use Stockfish)
└── utils/
    └── sounds.js          # Web Audio API sound effects
```

## Deployment

Designed for Vercel deployment:
```bash
npm run build
npx vercel
```

### Service Worker Cache

The app uses a service worker (`public/sw.js`) for offline play. When deploying updates that change asset hashes, bump the `CACHE_NAME` version in `sw.js` to invalidate stale caches:

```js
const CACHE_NAME = 'kids-chess-v2'  // Increment on deploy
```

Without this, users may get cached HTML referencing old JS files that no longer exist.
