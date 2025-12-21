import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';

// Simple AI that works on all difficulty levels
// Level 1-3: Mostly random, occasionally makes good moves
// Level 4-6: Prefers captures and checks, but makes mistakes
// Level 7-10: Evaluates positions, prefers good moves

function evaluateMove(game, move) {
  const testGame = new Chess(game.fen());
  testGame.move(move);

  let score = 0;

  // Checkmate is the best
  if (testGame.isCheckmate()) {
    return 10000;
  }

  // Check is good
  if (testGame.isCheck()) {
    score += 50;
  }

  // Captures are good (weighted by piece value)
  const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  if (move.captured) {
    score += (pieceValues[move.captured] || 0) * 100;
  }

  // Center control is good
  const centerSquares = ['d4', 'd5', 'e4', 'e5'];
  if (centerSquares.includes(move.to)) {
    score += 10;
  }

  // Development is good (moving pieces off back rank early)
  const backRank = game.turn() === 'w' ? '1' : '8';
  if (move.from[1] === backRank && move.piece !== 'p' && move.piece !== 'k') {
    score += 5;
  }

  // Avoid moving into attacked squares (simple check)
  const opponentColor = game.turn() === 'w' ? 'b' : 'w';
  if (testGame.isAttacked(move.to, opponentColor)) {
    score -= (pieceValues[move.piece] || 1) * 30;
  }

  return score;
}

function getBestMoveForDifficulty(fen, difficulty) {
  const game = new Chess(fen);
  const moves = game.moves({ verbose: true });

  if (moves.length === 0) return null;

  // Calculate scores for all moves
  const scoredMoves = moves.map(move => ({
    move,
    score: evaluateMove(game, move) + Math.random() * 20, // Add randomness
  }));

  // Sort by score (best first)
  scoredMoves.sort((a, b) => b.score - a.score);

  // Based on difficulty, pick from different parts of the sorted list
  // Level 1: Pick randomly from all moves (with slight preference for captures)
  // Level 5: Pick from top 50%
  // Level 10: Pick from top 20%

  let pickRange;
  if (difficulty <= 2) {
    // Very easy: random move, but prefer captures slightly
    const captures = scoredMoves.filter(m => m.move.captured);
    if (captures.length > 0 && Math.random() < 0.3) {
      return captures[Math.floor(Math.random() * captures.length)].move;
    }
    return moves[Math.floor(Math.random() * moves.length)];
  } else if (difficulty <= 4) {
    // Easy: pick from top 70%
    pickRange = Math.max(1, Math.floor(scoredMoves.length * 0.7));
  } else if (difficulty <= 6) {
    // Medium: pick from top 50%
    pickRange = Math.max(1, Math.floor(scoredMoves.length * 0.5));
  } else if (difficulty <= 8) {
    // Hard: pick from top 30%
    pickRange = Math.max(1, Math.floor(scoredMoves.length * 0.3));
  } else {
    // Very hard: pick from top 15%
    pickRange = Math.max(1, Math.floor(scoredMoves.length * 0.15));
  }

  const selectedIndex = Math.floor(Math.random() * pickRange);
  return scoredMoves[selectedIndex].move;
}

export function useStockfish(difficulty = 5) {
  const [isThinking, setIsThinking] = useState(false);

  const getBestMove = useCallback(async (fen) => {
    setIsThinking(true);

    // Add a thinking delay based on difficulty (feels more natural)
    const thinkTime = 300 + difficulty * 100 + Math.random() * 500;
    await new Promise(resolve => setTimeout(resolve, thinkTime));

    const move = getBestMoveForDifficulty(fen, difficulty);
    setIsThinking(false);

    if (move) {
      // Return in UCI format (e.g., "e2e4")
      return move.from + move.to + (move.promotion || '');
    }
    return null;
  }, [difficulty]);

  const stopThinking = useCallback(() => {
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
