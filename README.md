# Kids Chess

A simple, ad-free chess app for young children. Built with React and designed for tablets.

## Features

- **Two game modes**: Play against the computer or pass-and-play with a friend
- **Adjustable difficulty**: 10 levels from "nearly random" to challenging
- **Kid-friendly UI**:
  - Tap-tap interaction (tap piece, tap destination)
  - Legal move highlighting (dots show where pieces can go)
  - Threatened piece indicators (red outline on pieces under attack)
  - Large, touch-friendly pieces
- **Undo button**: Let kids take back mistakes
- **Sound effects**: Audio feedback for moves, captures, and wins
- **No ads, no accounts, no tracking**

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Production Build

```bash
npm run build
```

### Deploy to Vercel

```bash
npx vercel
```

## How to Play

1. Choose **"Play vs Computer"** or **"Play vs Friend"**
2. If playing against the computer:
   - Pick your color (white goes first)
   - Choose difficulty (1 = easiest, 10 = hardest)
3. Tap a piece to select it (highlights yellow, shows legal moves as dots)
4. Tap a destination square to move
5. Use the **Undo** button to take back moves
6. Use **New Game** to start over

## Difficulty Levels

| Level | Description |
|-------|-------------|
| 1-2 | Nearly random moves - great for beginners |
| 3-4 | Makes occasional good moves |
| 5-6 | Prefers captures and checks |
| 7-8 | Plays reasonably well |
| 9-10 | Challenging opponent |

## Tech Stack

- [Vite](https://vitejs.dev/) - Build tool
- [React](https://react.dev/) - UI framework
- [chess.js](https://github.com/jhlywa/chess.js) - Chess logic
- [react-chessboard](https://github.com/Clariity/react-chessboard) - Board component

## License

MIT
# chess
