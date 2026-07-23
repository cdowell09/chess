import { useState, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';

// Simple AI that works on all difficulty levels
// Level 1-3: Mostly random, occasionally makes good moves
// Level 4-6: Prefers captures and checks, but makes mistakes
// Level 7-10: Evaluates positions deeply, plays strong chess

const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

// Piece-square tables for positional evaluation (from white's perspective)
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
  0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const PIECE_TABLES = {
  p: PAWN_TABLE,
  n: KNIGHT_TABLE,
  b: BISHOP_TABLE,
  r: ROOK_TABLE,
  q: QUEEN_TABLE
};

function squareToIndex(square) {
  const file = square.charCodeAt(0) - 97; // a=0, h=7
  const rank = parseInt(square[1]) - 1;   // 1=0, 8=7
  return (7 - rank) * 8 + file;
}

function getPieceSquareValue(piece, square, color) {
  const table = PIECE_TABLES[piece];
  if (!table) return 0;

  let index = squareToIndex(square);
  // Flip for black
  if (color === 'b') {
    index = 63 - index;
  }
  return table[index];
}

// Evaluate the entire board position
function evaluatePosition(game) {
  const board = game.board();
  let score = 0;

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece) {
        const square = String.fromCharCode(97 + file) + (8 - rank);
        const pieceValue = PIECE_VALUES[piece.type] || 0;
        const positionValue = getPieceSquareValue(piece.type, square, piece.color);
        const totalValue = pieceValue + positionValue;

        if (piece.color === game.turn()) {
          score += totalValue;
        } else {
          score -= totalValue;
        }
      }
    }
  }

  return score;
}

// Simple evaluation for lower difficulty levels
function evaluateMoveSimple(game, move) {
  const testGame = new Chess(game.fen());
  testGame.move(move);

  let score = 0;

  if (testGame.isCheckmate()) {
    return 10000;
  }

  if (testGame.isCheck()) {
    score += 50;
  }

  if (move.captured) {
    score += (PIECE_VALUES[move.captured] || 0);
  }

  const centerSquares = ['d4', 'd5', 'e4', 'e5'];
  if (centerSquares.includes(move.to)) {
    score += 10;
  }

  const backRank = game.turn() === 'w' ? '1' : '8';
  if (move.from[1] === backRank && move.piece !== 'p' && move.piece !== 'k') {
    score += 5;
  }

  const opponentColor = game.turn() === 'w' ? 'b' : 'w';
  if (testGame.isAttacked(move.to, opponentColor)) {
    score -= (PIECE_VALUES[move.piece] || 100) / 3;
  }

  return score;
}

// Advanced evaluation with positional understanding
function evaluateMoveAdvanced(game, move, depth = 0) {
  const testGame = new Chess(game.fen());
  testGame.move(move);

  // Checkmate is the best
  if (testGame.isCheckmate()) {
    return 100000 - depth; // Prefer faster checkmates
  }

  // Stalemate is bad if we're winning
  if (testGame.isStalemate() || testGame.isDraw()) {
    return 0;
  }

  let score = 0;

  // Material and positional evaluation
  score = -evaluatePosition(testGame); // Negative because it's opponent's turn after our move

  // Bonus for giving check
  if (testGame.isCheck()) {
    score += 30;
  }

  // Capture bonus (in addition to material gained)
  if (move.captured) {
    // MVV-LVA: prioritize capturing high-value pieces with low-value pieces
    const victimValue = PIECE_VALUES[move.captured] || 100;
    const attackerValue = PIECE_VALUES[move.piece] || 100;
    score += (victimValue - attackerValue / 10);
  }

  // Penalty for moving to attacked squares without compensation
  const opponentColor = game.turn() === 'w' ? 'b' : 'w';
  if (testGame.isAttacked(move.to, opponentColor)) {
    const pieceValue = PIECE_VALUES[move.piece] || 100;
    // Check if the square is defended
    const ourColor = game.turn();
    const isDefended = testGame.isAttacked(move.to, ourColor);
    if (!isDefended) {
      score -= pieceValue;
    } else if (!move.captured) {
      // Even if defended, trading down might be bad
      score -= pieceValue / 4;
    }
  }

  // Castle bonus
  if (move.flags.includes('k') || move.flags.includes('q')) {
    score += 60;
  }

  return score;
}

// Minimax with alpha-beta pruning for highest difficulty
function minimax(game, depth, alpha, beta, maximizing) {
  if (depth === 0 || game.isGameOver()) {
    return evaluatePosition(game);
  }

  const moves = game.moves({ verbose: true });

  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function evaluateMoveWithLookahead(game, move, depth) {
  const testGame = new Chess(game.fen());
  testGame.move(move);

  if (testGame.isCheckmate()) {
    return 100000;
  }

  if (testGame.isStalemate() || testGame.isDraw()) {
    return 0;
  }

  // Use minimax to look ahead
  return -minimax(testGame, depth - 1, -Infinity, Infinity, true);
}

function getBestMoveForDifficulty(fen, difficulty) {
  const game = new Chess(fen);
  const moves = game.moves({ verbose: true });

  if (moves.length === 0) return null;

  // Level 1-2: Very easy - mostly random, kid-friendly
  if (difficulty <= 2) {
    const scoredMoves = moves.map(move => ({
      move,
      score: evaluateMoveSimple(game, move) + Math.random() * 50,
    }));
    scoredMoves.sort((a, b) => b.score - a.score);

    // 30% chance to pick a capture if available
    const captures = scoredMoves.filter(m => m.move.captured);
    if (captures.length > 0 && Math.random() < 0.3) {
      return captures[Math.floor(Math.random() * captures.length)].move;
    }
    // Otherwise mostly random
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Level 3-4: Easy - prefers good moves but makes mistakes
  if (difficulty <= 4) {
    const scoredMoves = moves.map(move => ({
      move,
      score: evaluateMoveSimple(game, move) + Math.random() * 30,
    }));
    scoredMoves.sort((a, b) => b.score - a.score);
    const pickRange = Math.max(1, Math.floor(scoredMoves.length * 0.6));
    return scoredMoves[Math.floor(Math.random() * pickRange)].move;
  }

  // Level 5-6: Medium - uses advanced evaluation but with some randomness
  if (difficulty <= 6) {
    const scoredMoves = moves.map(move => ({
      move,
      score: evaluateMoveAdvanced(game, move) + Math.random() * 15,
    }));
    scoredMoves.sort((a, b) => b.score - a.score);
    const pickRange = Math.max(1, Math.floor(scoredMoves.length * 0.35));
    return scoredMoves[Math.floor(Math.random() * pickRange)].move;
  }

  // Level 7-8: Hard - advanced evaluation with minimal randomness
  if (difficulty <= 8) {
    const scoredMoves = moves.map(move => ({
      move,
      score: evaluateMoveAdvanced(game, move) + Math.random() * 5,
    }));
    scoredMoves.sort((a, b) => b.score - a.score);
    // Pick from top 15%
    const pickRange = Math.max(1, Math.floor(scoredMoves.length * 0.15));
    return scoredMoves[Math.floor(Math.random() * pickRange)].move;
  }

  // Level 9: Very hard - uses 2-ply lookahead
  if (difficulty === 9) {
    const scoredMoves = moves.map(move => ({
      move,
      score: evaluateMoveWithLookahead(game, move, 2),
    }));
    scoredMoves.sort((a, b) => b.score - a.score);
    // Pick from top 10% with tiny randomness
    const pickRange = Math.max(1, Math.floor(scoredMoves.length * 0.1));
    return scoredMoves[Math.floor(Math.random() * pickRange)].move;
  }

  // Level 10: Maximum difficulty - uses 3-ply lookahead, always picks best move
  const scoredMoves = moves.map(move => ({
    move,
    score: evaluateMoveWithLookahead(game, move, 3),
  }));
  scoredMoves.sort((a, b) => b.score - a.score);
  // Always pick the best move at max difficulty
  return scoredMoves[0].move;
}

export function useStockfish(difficulty = 5) {
  const [isThinking, setIsThinking] = useState(false);
  const requestIdRef = useRef(0);

  const getBestMove = useCallback(async (fen) => {
    const requestId = ++requestIdRef.current;
    setIsThinking(true);

    // Add a thinking delay based on difficulty (feels more natural)
    const thinkTime = 300 + difficulty * 100 + Math.random() * 500;
    await new Promise(resolve => setTimeout(resolve, thinkTime));
    if (requestId !== requestIdRef.current) return null;

    const move = getBestMoveForDifficulty(fen, difficulty);
    if (requestId !== requestIdRef.current) return null;
    setIsThinking(false);

    if (move) {
      // Return in UCI format (e.g., "e2e4")
      return move.from + move.to + (move.promotion || '');
    }
    return null;
  }, [difficulty]);

  const stopThinking = useCallback(() => {
    requestIdRef.current += 1;
    setIsThinking(false);
  }, []);

  return {
    isReady: true, // Always ready since we don't need to load anything
    isThinking,
    getBestMove,
    stopThinking,
  };
}

// Export for fallback use
export function getRandomMove(game) {
  const moves = game.moves();
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}
