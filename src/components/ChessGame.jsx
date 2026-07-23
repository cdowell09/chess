import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
    gameResult,
    getLegalMoves,
    getThreatenedSquares,
    makeMove,
    undoMove,
    undoTwoMoves,
    resetGame,
    canUndo,
  } = useChessGame();

  const {
    isReady: stockfishReady,
    isThinking,
    getBestMove,
    stopThinking,
  } = useStockfish(difficulty);

  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const computerMoveIdRef = useRef(0);
  const boardRegionRef = useRef(null);

  // Is it the player's turn? (in friend mode, always true for current player)
  const isPlayerTurn = mode === 'friend' || turn === playerColor;
  const isComputerTurn = mode === 'computer' && turn !== playerColor && !isGameOver;

  // Get threatened squares for highlighting
  const threatenedSquares = useMemo(() => getThreatenedSquares(), [getThreatenedSquares]);

  // Computer makes a move
  useEffect(() => {
    if (!isComputerTurn || isGameOver) return;

    const moveId = ++computerMoveIdRef.current;
    let cancelled = false;
    const requestIsStale = () => cancelled || moveId !== computerMoveIdRef.current;

    const makeComputerMove = async () => {
      // Add a small delay so kids can see what happened
      await new Promise(resolve => setTimeout(resolve, 500));
      if (requestIsStale()) return;

      let bestMove = null;

      if (stockfishReady) {
        bestMove = await getBestMove(position);
        if (requestIsStale()) return;
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

      if (bestMove && !requestIsStale()) {
        const from = bestMove.substring(0, 2);
        const to = bestMove.substring(2, 4);
        const promotion = bestMove.length > 4 ? bestMove[4] : 'q';

        const result = makeMove(from, to, promotion);
        if (result.success) {
          setLastMove({ from, to });
          // Play appropriate sound
          if (result.isCheckmate) {
            playSound('check');
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

    return () => {
      cancelled = true;
      if (computerMoveIdRef.current === moveId) {
        computerMoveIdRef.current += 1;
      }
      stopThinking();
    };
  }, [isComputerTurn, isGameOver, position, stockfishReady, getBestMove, makeMove, stopThinking]);

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

  // Give the board's square elements useful keyboard and screen-reader behavior.
  useEffect(() => {
    const boardElement = boardRegionRef.current;
    if (!boardElement) return;

    const currentGame = new Chess(position);
    const pieceNames = {
      p: 'pawn',
      n: 'knight',
      b: 'bishop',
      r: 'rook',
      q: 'queen',
      k: 'king',
    };
    const listeners = [];

    boardElement.querySelectorAll('[data-square]').forEach((squareElement) => {
      const square = squareElement.dataset.square;
      const piece = currentGame.get(square);
      const isSelectable = piece && getLegalMoves(square).length > 0;
      const isDestination = selectedSquare && legalMoves.includes(square);
      const isKeyboardTarget = isPlayerTurn
        && !isGameOver
        && !isThinking
        && (isDestination || selectedSquare === square || (!selectedSquare && isSelectable));
      const pieceLabel = piece
        ? `, ${piece.color === 'w' ? 'white' : 'black'} ${pieceNames[piece.type]}`
        : ', empty';
      const stateLabel = selectedSquare === square
        ? ', selected'
        : isDestination
          ? ', legal destination'
          : '';

      squareElement.setAttribute('role', 'button');
      squareElement.setAttribute('tabindex', isKeyboardTarget ? '0' : '-1');
      squareElement.setAttribute('aria-disabled', String(!isKeyboardTarget));
      squareElement.setAttribute('aria-label', `${square}${pieceLabel}${stateLabel}`);

      squareElement.querySelectorAll('button').forEach((pieceButton) => {
        pieceButton.setAttribute('aria-hidden', 'true');
        pieceButton.setAttribute('tabindex', '-1');
      });

      const handleKeyDown = (event) => {
        if (isKeyboardTarget && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          handleSquareClick(square);
        }
      };

      squareElement.addEventListener('keydown', handleKeyDown);
      listeners.push([squareElement, handleKeyDown]);
    });

    return () => {
      listeners.forEach(([squareElement, handleKeyDown]) => {
        squareElement.removeEventListener('keydown', handleKeyDown);
      });
    };
  }, [
    position,
    selectedSquare,
    legalMoves,
    isPlayerTurn,
    isGameOver,
    isThinking,
    getLegalMoves,
    handleSquareClick,
  ]);

  // Wrapper for react-chessboard's onSquareClick (receives object)
  const onSquareClick = useCallback(({ square }) => {
    handleSquareClick(square);
  }, [handleSquareClick]);

  // Wrapper for react-chessboard's onPieceClick (receives object)
  const onPieceClick = useCallback(({ square }) => {
    handleSquareClick(square);
  }, [handleSquareClick]);

  // Handle piece drag (optional, but react-chessboard supports it)
  const onPieceDrop = useCallback(({ sourceSquare, targetSquare }) => {
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
    computerMoveIdRef.current += 1;
    stopThinking();
    if (mode === 'computer') {
      // Undo both player and computer move
      undoTwoMoves();
    } else {
      undoMove();
    }
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
  }, [mode, undoMove, undoTwoMoves, stopThinking]);

  // Handle new game
  const handleNewGame = useCallback(() => {
    computerMoveIdRef.current += 1;
    stopThinking();
    resetGame();
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
  }, [resetGame, stopThinking]);

  // Build custom square styles
  const customSquareStyles = useMemo(() => {
    const styles = {};

    // Highlight selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'var(--selected-square)',
      };
    }

    // Highlight legal move squares with dots
    legalMoves.forEach(square => {
      styles[square] = {
        background: 'radial-gradient(circle, var(--legal-move) 25%, transparent 26%)',
        cursor: 'pointer',
      };
    });

    // Highlight last move
    if (lastMove) {
      styles[lastMove.from] = {
        ...styles[lastMove.from],
        backgroundColor: 'var(--last-move-from)',
      };
      styles[lastMove.to] = {
        ...styles[lastMove.to],
        backgroundColor: 'var(--last-move-to)',
      };
    }

    // Highlight threatened pieces
    threatenedSquares.forEach(square => {
      styles[square] = {
        ...styles[square],
        boxShadow: 'inset 0 0 0 3px var(--danger-ring)',
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
              backgroundColor: 'var(--check-square)',
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

  const whiteName = mode === 'computer'
    ? (playerColor === 'w' ? 'You' : 'Computer')
    : 'White';
  const blackName = mode === 'computer'
    ? (playerColor === 'b' ? 'You' : 'Computer')
    : 'Black';
  const matchLabel = mode === 'computer'
    ? `Computer · Level ${difficulty}`
    : 'Pass & Play';
  const liveStatus = isGameOver
    ? (gameResult === 'draw'
        ? "It's a draw!"
        : `${gameResult === 'white' ? 'White' : 'Black'} wins!`)
    : `${turnText}${isCheck ? ' Check!' : ''}`;
  const statusTone = isCheck
    ? 'danger'
    : (isComputerTurn || isThinking)
        ? 'thinking'
        : 'ready';
  const helperText = isComputerTurn || isThinking
    ? 'The computer is choosing a move.'
    : selectedSquare
      ? 'Now choose a highlighted square.'
      : 'Tap a piece, then tap where it should go.';

  return (
    <section className="chess-game" aria-label="Chess game">
      <div className="game-stage">
        <div className="game-topbar">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <span className="match-label">
            <span aria-hidden="true">♟</span>
            {matchLabel}
          </span>
        </div>

        <div className="match-strip">
          <div className={`player-seat player-seat--white ${turn === 'w' && !isGameOver ? 'active' : ''}`}>
            <span className="seat-piece" aria-hidden="true">♔</span>
            <span className="seat-copy">
              <strong>{whiteName}</strong>
              <span>White pieces</span>
            </span>
          </div>

          <div
            className={`turn-indicator status-pill status-pill--${statusTone}`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="status-dot" aria-hidden="true" />
            <span>{liveStatus}</span>
          </div>

          <div className={`player-seat player-seat--black ${turn === 'b' && !isGameOver ? 'active' : ''}`}>
            <span className="seat-piece" aria-hidden="true">♚</span>
            <span className="seat-copy">
              <strong>{blackName}</strong>
              <span>Black pieces</span>
            </span>
          </div>
        </div>

        <div
          className="board-container"
          ref={boardRegionRef}
          role="group"
          aria-label="Chess board"
          aria-describedby="board-instructions"
        >
          <p className="visually-hidden" id="board-instructions">
            Use Tab to reach a movable piece, press Enter or Space to select it,
            then choose a legal destination.
          </p>
          <Chessboard
            options={{
              id: 'kids-chess-board',
              position: position,
              onSquareClick: onSquareClick,
              onPieceDrop: onPieceDrop,
              onPieceClick: onPieceClick,
              boardOrientation: boardOrientation,
              squareStyles: customSquareStyles,
              animationDurationInMs: 200,
              allowDragging: false,
              allowDrawingArrows: false,
              boardStyle: {
                borderRadius: '12px',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--line)',
              },
              darkSquareStyle: { backgroundColor: 'var(--board-dark)' },
              lightSquareStyle: { backgroundColor: 'var(--board-light)' },
            }}
          />
        </div>

        <div className="game-footer action-rail">
          <p className="game-helper" aria-live="polite">{helperText}</p>
          <div className="game-controls">
            <button
              className="control-button undo-button"
              onClick={handleUndo}
              disabled={!canUndo || isThinking || isComputerTurn}
            >
              <span aria-hidden="true">↶</span>
              Undo
            </button>
            <button
              className="control-button new-game-button"
              onClick={handleNewGame}
            >
              <span aria-hidden="true">↻</span>
              New Game
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
