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

  // Get game result
  const gameResult = useMemo(() => {
    if (!isGameOver) return null;
    if (game.isCheckmate()) {
      return turn === 'w' ? 'black' : 'white'; // Winner is opposite of current turn
    }
    if (game.isStalemate() || game.isDraw()) {
      return 'draw';
    }
    return null;
  }, [isGameOver, turn, game]);

  // Get all legal moves for a piece at a given square
  const getLegalMoves = useCallback((square) => {
    const moves = game.moves({ square, verbose: true });
    return moves.map(move => move.to);
  }, [game]);

  // Get all squares with pieces that are under attack
  const getThreatenedSquares = useCallback(() => {
    const threatened = [];
    const board = game.board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          const square = String.fromCharCode(97 + col) + (8 - row);
          const attackerColor = piece.color === 'w' ? 'b' : 'w';
          if (game.isAttacked(square, attackerColor)) {
            threatened.push(square);
          }
        }
      }
    }
    return threatened;
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
        };
      }
    } catch {
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

  return {
    position,
    turn,
    isGameOver,
    isCheck,
    gameResult,
    getLegalMoves,
    getThreatenedSquares,
    makeMove,
    undoMove,
    undoTwoMoves,
    resetGame,
    canUndo: moveHistory.length > 0,
  };
}
