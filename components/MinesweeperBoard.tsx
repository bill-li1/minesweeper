import React from 'react';

function placeMines(rows: number, cols: number, numBombs: number, board: string[][]): string[][] {
    let minesPlaced = 0;
    while (minesPlaced < numBombs) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (board[r][c] === '0') { // Assuming '0' is a string here; adjust if it's meant to be a number
            board[r][c] = "M"; // "M" for mine
            minesPlaced++;
        }
    }
    // Further logic to calculate numbers around mines can be added here
    return board;
}

function createBoard(rows: number, cols: number, numBombs: number): string[][] {
    let board = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill('0')); // Assuming '0' is a string for consistency with "M"
    
    // Place mines on the board
    board = placeMines(rows, cols, numBombs, board);
    return board;
}

const MinesweeperBoard: React.FC = () => {
    const rows = 12;
    const cols = 16;
    const numBombs = 20;
    const board = createBoard(rows, cols, numBombs);

    return (
        <div>
            {board.map((row, i) => (
                <div key={i} className="flex">
                    {row.map((cell, r_i) => (
                        <div
                            key={`cell-${i}-${r_i}`}
                            className={`p-2 border-2 border-teal-500 h-12 w-12 flex justify-center items-center ${cell === "M" ? "bg-red-500" : ""}`}
                        >
                            {cell}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default MinesweeperBoard;
