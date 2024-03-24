/*
This file will have all logic related to 
- creating a board
- board difficulty
- user plays
- checking if a move is valid


*/

type TileState = 'hidden' | 'revealed' | 'flagged';
type TileContent = 'M' | number;
type Tile = {
    state: TileState;
    content: TileContent;
};

function placeMines(rows: number, cols: number, numBombs: number, board: Tile[][]): Tile[][] {
    let minesPlaced = 0;
    while (minesPlaced < numBombs) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (board[r][c].content !== 'M') { // Check if the tile is not already a mine
            board[r][c].content = 'M'; // Place a mine
            minesPlaced++;
        }
    }
    return board;
}

function countAdjacentMines(board: Tile[][], rows: number, cols: number): Tile[][] {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].content === 'M') continue; // Skip if the tile is a mine
            let mineCount = 0;
            // Check all adjacent tiles
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue; // Skip the tile itself
                    const adjR = r + i;
                    const adjC = c + j;
                    if (adjR >= 0 && adjR < rows && adjC >= 0 && adjC < cols && board[adjR][adjC].content === 'M') {
                        mineCount++;
                    }
                }
            }
            board[r][c].content = mineCount; // Update the tile with the count of adjacent mines
        }
    }
    return board;
}

function createBoard(rows: number, cols: number, numBombs: number): Tile[][] {
    let board: Tile[][] = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(null).map(() => ({ state: 'hidden', content: 0 })));
    
    board = placeMines(rows, cols, numBombs, board); // Place mines
    board = countAdjacentMines(board, rows, cols); // Count and update adjacent mines
    return board;
}
