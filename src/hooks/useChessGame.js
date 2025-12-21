import { useState, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';

export function useChessGame() {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);

  // Get current position in FEN format
  const position = game.fen();
  const turn = game.turn(); // 'w' or 'b'
  const isGameOver = game.isGameOver();
  const isCheck = game.isCheck();
  const isCheckmate = game.isCheckmate();
  const isStalemate = game.isStalemate();
  const isDraw = game.isDraw();

  // Get game result
  const gameResult = useMemo(() => {
    if (!isGameOver) return null;
    if (isCheckmate) {
      return turn === 'w' ? 'black' : 'white'; // Winner is opposite of current turn
    }
    if (isStalemate || isDraw) {
      return 'draw';
    }
    return null;
  }, [isGameOver, isCheckmate, isStalemate, isDraw, turn]);

  // Get all legal moves for a piece at a given square
  const getLegalMoves = useCallback((square) => {
    const moves = game.moves({ square, verbose: true });
    return moves.map(move => move.to);
  }, [game]);

  // Get all squares with pieces that are under attack
  const getThreatenedSquares = useCallback(() => {
    const dominated = [];
    const dominated_opponent = []
    const dominated_mine = [];
    const dominated_mine_opponent = []
    const dominated_opponent_mine = []
    // Check each square for pieces under attack
    const board = game.board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          const square = String.fromCharCode(97 + col) + (8 - row);
          // isAttacked checks if a square is attacked by the given color
          // We want to see if this piece is attacked by the opponent
          const attackerColor = piece.color === 'w' ? 'b' : 'w';
          if (game.isAttacked(square, attackerColor)) {
            dominated.push(square);
          }
        }
      }
    }
    return dominated;
  }, [game]);

  // Make a move - returns { success, captured, isCheck, isCheckmate }
  const makeMove = useCallback((from, to, promotion = 'q') => {
    const gameCopy = new Chess(game.fen());

    try {
      const move = gameCopy.move({
        from,
        to,
        promotion, // Always promote to queen for simplicity
      });

      if (move) {
        setMoveHistory(prev => [...prev, game.fen()]);
        setGame(gameCopy);
        return {
          success: true,
          captured: move.captured,
          isCheck: gameCopy.isCheck(),
          isCheckmate: gameCopy.isCheckmate(),
          san: move.san,
        };
      }
    } catch (e) {
      // Invalid move
    }

    return { success: false };
  }, [game]);

  // Undo the last move
  const undoMove = useCallback(() => {
    if (moveHistory.length === 0) return false;

    const previousFen = moveHistory[moveHistory.length - 1];
    setGame(new Chess(previousFen));
    setMoveHistory(prev => prev.slice(0, -1));
    return true;
  }, [moveHistory]);

  // Undo two moves (for playing against computer - undo both player and computer move)
  const undoTwoMoves = useCallback(() => {
    if (moveHistory.length < 2) return undoMove();

    const previousFen = moveHistory[moveHistory.length - 2];
    setGame(new Chess(previousFen));
    setMoveHistory(prev => prev.slice(0, -2));
    return true;
  }, [moveHistory, undoMove]);

  // Reset the game
  const resetGame = useCallback(() => {
    setGame(new Chess());
    setMoveHistory([]);
  }, []);

  // Load a specific position
  const loadPosition = useCallback((fen) => {
    try {
      const newGame = new Chess(fen);
      setGame(newGame);
      setMoveHistory([]);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    position,
    turn,
    isGameOver,
    isCheck,
    isCheckmate,
    isStalemate,
    isDraw,
    gameResult,
    getLegalMoves,
    getThreatenedSquares,
    makeMove,
    undoMove,
    undoTwoMoves,
    resetGame,
    loadPosition,
    canUndo: moveHistory.length > 0,
  };
}
