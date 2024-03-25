import { useState, useEffect } from 'react';
import './minesweeper.css';

type Cell = {
    isMine: boolean;
    isRevealed: boolean;
    isMarked: boolean;
    adjacentMines: number;
};

type Board = Cell[][];


// Define the size of the board and number of mines
const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 15;

// A helper function to generate an initial board
const generateBoard = (): Board => {
    const board: Board = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, (): Cell => ({
        isMine: false,
        isRevealed: false,
        isMarked: false,
        adjacentMines: 0,
      }))
    );

    // Randomly place mines - this logic can be improved for a better gameplay experience
    let minesPlaced = 0;
    while (minesPlaced < NUMBER_OF_MINES) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }

    // Calculate adjacent mines for each cell
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col].isMine) {
                continue;
            }
            let count = 0;
            for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (
                    newRow >= 0 &&
                    newRow < BOARD_SIZE &&
                    newCol >= 0 &&
                    newCol < BOARD_SIZE &&
                    board[newRow][newCol].isMine
                ) {
                    count++;
                }
            }
            }
            board[row][col].adjacentMines = count;
        }
    }

    return board;
};

const Minesweeper = () => {
    const [board, setBoard] = useState<Board>(generateBoard());
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [timer, setTimer] = useState<number | null>(null);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    
    useEffect(() => {
        if (gameStarted && !gameOver) {
            const intervalId = window.setInterval(() => {
                setTimeElapsed((prevTime) => prevTime + 1);
            }, 1000);
    
            return () => clearInterval(intervalId);
        }
    }, [gameStarted, gameOver]);
     
    
    const resetGame = () => {
        setBoard(generateBoard());
        setGameOver(false);
        setGameStarted(false); // Add this line
        setTimeElapsed(0);
        if (timer !== null) clearInterval(timer);
        setTimer(null); // Reset the timer state
    };

    const checkWin = (board: Board) => {
        for (const row of board) {
            for (const cell of row) {
                if (cell.isMine && !cell.isMarked) {
                    return; // A mine is not marked
                }
                if (!cell.isMine && !cell.isRevealed) {
                    return; // A non-mine cell is not revealed
                }
            }
        }
        // If we reach here, the player has won
        setGameOver(true);
        alert('Congratulations! You won!');
    };

    const markCell = (row: number, col: number, event: React.MouseEvent) => {
        event.preventDefault(); // Prevent the context menu
        if (gameOver || board[row][col].isRevealed) {
            return;
        }
        const newBoard = [...board];
        newBoard[row][col].isMarked = !newBoard[row][col].isMarked;
        setBoard(newBoard);
        checkWin(newBoard); // Check if the player has won after marking a cell
    };

    const revealCell = (row: number, col: number) => {
        if (gameOver || board[row][col].isRevealed) {
            return;
        }
    
        const newBoard = [...board];
        // DFS reveal cells
        const reveal = (r: number, c: number) => {
            if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || newBoard[r][c].isRevealed || newBoard[r][c].isMarked) {
                return; // Out of bounds or already revealed or flagged with right click
            }

            newBoard[r][c].isRevealed = true; // Reveal this cell
            if (newBoard[r][c].isMine) {
                setGameOver(true);
                return;
            }
            // If the cell does not have adjacent mines, reveal its neighbors
            if (newBoard[r][c].adjacentMines === 0) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i === 0 && j === 0) continue; // Skip the curr cell
                        reveal(r + i, c + j); // DFS reveal neighbours
                    }
                }
            }
        };
    
        reveal(row, col);
        setBoard(newBoard);
    };

    return (
        <div className="game-container">
            <div className="game-controls">
                <h1>Minesweeper</h1>
                {!gameStarted ? (
                    <button onClick={() => setGameStarted(true)}>Start Game</button>
                ) : (
                    <button onClick={resetGame}>Reset Game</button>
                )}
                {gameOver && <div>Game Over. Click reset to play again.</div>}
                <div>Time Elapsed: {timeElapsed} seconds</div>
            </div>
            <div className="board">
                {board.flatMap((row, rowIndex) =>
                    row.map((cell, cellIndex) => (
                        <div
                            key={`${rowIndex}-${cellIndex}`}
                            onClick={() => revealCell(rowIndex, cellIndex)}
                            onContextMenu={(e) => markCell(rowIndex, cellIndex, e)}
                            className={`cell ${cell.isRevealed ? "revealed" : ""} ${cell.isMarked ? "marked" : ""}`}
                        >
                            {cell.isMarked && !cell.isRevealed ? "🚩" : cell.isRevealed && (cell.isMine ? '💣' : cell.adjacentMines > 0 ? cell.adjacentMines : '')}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
};

export default Minesweeper;