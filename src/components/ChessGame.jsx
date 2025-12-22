import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useChessGame } from '../hooks/useChessGame';
import { useStockfish, getRandomMove } from '../hooks/useStockfish';
import { playSound } from '../utils/sounds';
import './ChessGame.css';

export function ChessGame({
  mode, // 'computer' or 'friend'
  playerColor = 'w', // 'w' or 'b' (only used in computer mode)
  difficulty = 5, // 1-10 (only used in computer mode)
  onGameOver,
  onBack,
}) {
  const {
    position,
    turn,
    isGameOver,
    isCheck,
    isCheckmate,
    gameResult,
    getLegalMoves,
    getThreatenedSquares,
    makeMove,
    undoMove,
    undoTwoMoves,
    resetGame,
    canUndo,
  } = useChessGame();

  const { isReady: stockfishReady, isThinking, getBestMove } = useStockfish(difficulty);

  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);

  // Is it the player's turn? (in friend mode, always true for current player)
  const isPlayerTurn = mode === 'friend' || turn === playerColor;
  const isComputerTurn = mode === 'computer' && turn !== playerColor && !isGameOver;

  // Get threatened squares for highlighting
  const threatenedSquares = useMemo(() => getThreatenedSquares(), [position, getThreatenedSquares]);

  // Computer makes a move
  useEffect(() => {
    if (!isComputerTurn || isGameOver) return;

    const makeComputerMove = async () => {
      // Add a small delay so kids can see what happened
      await new Promise(resolve => setTimeout(resolve, 500));

      let bestMove = null;

      if (stockfishReady) {
        bestMove = await getBestMove(position);
      }

      // Fallback to random move if Stockfish didn't return anything
      if (!bestMove) {
        const tempGame = new Chess(position);
        const randomMove = getRandomMove(tempGame);
        if (randomMove) {
          // Parse the SAN move to get from/to squares
          const move = tempGame.move(randomMove);
          if (move) {
            bestMove = move.from + move.to + (move.promotion || '');
          }
        }
      }

      if (bestMove) {
        const from = bestMove.substring(0, 2);
        const to = bestMove.substring(2, 4);
        const promotion = bestMove.length > 4 ? bestMove[4] : 'q';

        const result = makeMove(from, to, promotion);
        if (result.success) {
          setLastMove({ from, to });
          // Play appropriate sound
          if (result.isCheckmate) {
            playSound('win');
          } else if (result.isCheck) {
            playSound('check');
          } else if (result.captured) {
            playSound('capture');
          } else {
            playSound('move');
          }
        }
      }
    };

    makeComputerMove();
  }, [isComputerTurn, isGameOver, position, stockfishReady, getBestMove, makeMove]);

  // Handle game over
  useEffect(() => {
    if (isGameOver && gameResult && onGameOver) {
      onGameOver(gameResult);
    }
  }, [isGameOver, gameResult, onGameOver]);

  // Handle square click (tap-tap interaction)
  const handleSquareClick = useCallback((square) => {
    if (!isPlayerTurn || isGameOver || isThinking) return;

    if (selectedSquare) {
      // Second tap - try to make a move
      if (legalMoves.includes(square)) {
        const result = makeMove(selectedSquare, square);
        if (result.success) {
          setLastMove({ from: selectedSquare, to: square });
          // Play appropriate sound
          if (result.isCheckmate) {
            playSound('win');
          } else if (result.isCheck) {
            playSound('check');
          } else if (result.captured) {
            playSound('capture');
          } else {
            playSound('move');
          }
        }
      }
      // Clear selection
      setSelectedSquare(null);
      setLegalMoves([]);
    } else {
      // First tap - select a piece
      const moves = getLegalMoves(square);
      if (moves.length > 0) {
        setSelectedSquare(square);
        setLegalMoves(moves);
        playSound('click');
      }
    }
  }, [selectedSquare, legalMoves, isPlayerTurn, isGameOver, isThinking, getLegalMoves, makeMove]);

  // Wrapper for react-chessboard's onSquareClick (receives object)
  const onSquareClick = useCallback(({ square }) => {
    handleSquareClick(square);
  }, [handleSquareClick]);

  // Wrapper for react-chessboard's onPieceClick (receives object)
  const onPieceClick = useCallback(({ square }) => {
    handleSquareClick(square);
  }, [handleSquareClick]);

  // Handle piece drag (optional, but react-chessboard supports it)
  const onPieceDrop = useCallback((sourceSquare, targetSquare) => {
    if (!isPlayerTurn || isGameOver || isThinking) return false;

    const result = makeMove(sourceSquare, targetSquare);
    if (result.success) {
      setLastMove({ from: sourceSquare, to: targetSquare });
      setSelectedSquare(null);
      setLegalMoves([]);
      // Play appropriate sound
      if (result.isCheckmate) {
        playSound('win');
      } else if (result.isCheck) {
        playSound('check');
      } else if (result.captured) {
        playSound('capture');
      } else {
        playSound('move');
      }
      return true;
    }
    return false;
  }, [isPlayerTurn, isGameOver, isThinking, makeMove]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (mode === 'computer') {
      // Undo both player and computer move
      undoTwoMoves();
    } else {
      undoMove();
    }
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
  }, [mode, undoMove, undoTwoMoves]);

  // Handle new game
  const handleNewGame = useCallback(() => {
    resetGame();
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
  }, [resetGame]);

  // Build custom square styles
  const customSquareStyles = useMemo(() => {
    const styles = {};

    // Highlight selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(47, 124, 109, 0.25)',
      };
    }

    // Highlight legal move squares with dots
    legalMoves.forEach(square => {
      styles[square] = {
        background: 'radial-gradient(circle, rgba(31, 41, 51, 0.25) 25%, transparent 25%)',
        cursor: 'pointer',
      };
    });

    // Highlight last move
    if (lastMove) {
      styles[lastMove.from] = {
        ...styles[lastMove.from],
        backgroundColor: 'rgba(207, 177, 120, 0.35)',
      };
      styles[lastMove.to] = {
        ...styles[lastMove.to],
        backgroundColor: 'rgba(207, 177, 120, 0.55)',
      };
    }

    // Highlight threatened pieces
    threatenedSquares.forEach(square => {
      styles[square] = {
        ...styles[square],
        boxShadow: 'inset 0 0 0 3px rgba(202, 85, 68, 0.6)',
      };
    });

    // Highlight king in check
    if (isCheck) {
      const board = new Chess(position).board();
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board[row][col];
          if (piece && piece.type === 'k' && piece.color === turn) {
            const square = String.fromCharCode(97 + col) + (8 - row);
            styles[square] = {
              ...styles[square],
              backgroundColor: 'rgba(202, 85, 68, 0.5)',
            };
          }
        }
      }
    }

    return styles;
  }, [selectedSquare, legalMoves, lastMove, threatenedSquares, isCheck, position, turn]);

  // Determine board orientation
  const boardOrientation = mode === 'computer' ? (playerColor === 'w' ? 'white' : 'black') : 'white';

  // Turn indicator text
  const turnText = mode === 'friend'
    ? `${turn === 'w' ? 'White' : 'Black'}'s turn`
    : isPlayerTurn
      ? 'Your turn!'
      : 'Computer is thinking...';

  return (
    <div className="chess-game">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <div className="turn-indicator">
          {isGameOver ? (
            <span className="game-over-text">
              {gameResult === 'draw' ? "It's a draw!" : `${gameResult === 'white' ? 'White' : 'Black'} wins!`}
            </span>
          ) : (
            <span className={isCheck ? 'check-warning' : ''}>
              {turnText}
              {isCheck && ' - Check!'}
            </span>
          )}
        </div>
      </div>

      <div className="board-container">
        <Chessboard
          options={{
            position: position,
            onSquareClick: onSquareClick,
            onPieceDrop: onPieceDrop,
            onPieceClick: onPieceClick,
            boardOrientation: boardOrientation,
            squareStyles: customSquareStyles,
            animationDurationInMs: 200,
            allowDragging: false,
            boardStyle: {
              borderRadius: '16px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(224, 216, 204, 0.9)',
            },
            darkSquareStyle: { backgroundColor: '#8aa091' },
            lightSquareStyle: { backgroundColor: '#f1e9dd' },
          }}
        />
      </div>

      <div className="game-controls">
        <button
          className="control-button undo-button"
          onClick={handleUndo}
          disabled={!canUndo || isThinking}
        >
          ↩ Undo
        </button>
        <button
          className="control-button new-game-button"
          onClick={handleNewGame}
        >
          🔄 New Game
        </button>
      </div>
    </div>
  );
}
