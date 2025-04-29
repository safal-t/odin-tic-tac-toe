function createPlayer(marker) {

    if (marker !== "X" && marker !== "O") {
        throw new Error("Player marker can either be 'X' or 'O'.")
    }

    const playerMarker = marker; 

    const makeMove = function(cell) {
        gameController.updateBoard(cell, playerMarker)
    }

    return {
        makeMove
    }
}

const gameBoard = (function() {

    const board = [
        "X", "X", "X",
        "O", "O", "O",
        "X", "X", "X"
    ]; 

    const getBoard = function() {
        return board
    }

    const getCell = function(cellIndex) { 
        return board[cellIndex]
    }

    const updateCell = function(cellIndex, marker) {
        board[cellIndex] = marker; 
    }

    const resetBoard = function() {
        board.fill("");
        console.log('Board reset')
    }

    return {
        getBoard,
        getCell,
        updateCell,
        resetBoard,
    }
})(); 

const gameController = (function() {
    let winner = null;

    const validateMove = function(cellIndex) {
        if (gameBoard.getCell(cellIndex) !== "") {
            throw new Error("Invalid move: Cell is not empty");
        }
    };

    const updateBoard = function(cellIndex, marker) {
        validateMove(cellIndex)
        gameBoard.updateCell(cellIndex, marker);
        displayController.updateDisplay(cellIndex, marker)
        handleGameState();
    };

    const handleGameState = function() {
        checkForWinner();
        checkForTie();
    };

    const checkForWinner = function() {
        const winCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (const [a, b, c] of winCombos) {
            if (
                gameBoard.getCell(a) &&
                gameBoard.getCell(a) === gameBoard.getCell(b) &&
                gameBoard.getCell(a) === gameBoard.getCell(c)
            ) {
                declareWinner(gameBoard.getCell(a));
            }
        }
    };

    const declareWinner = function(winner) {
        console.log(`The winner is ${winner}`);
        resetGame()
    };

    const checkForTie = function() {
        for (let i = 0; i < 9; i++) {
            if (gameBoard.getCell(i) === "") {
                return;
            }
        }
        if (!winner) {
            declareTie();
        }
    };

    const declareTie = function() {
        console.log("The game is tied");
        resetGame()
    };

    const resetGame = function() {
        gameBoard.resetBoard();
        winner = null;
        console.log("Game reset");
    };

    return {
        updateBoard,
    };

})();

const displayController = (function() { 

    const MESSAGE = document.querySelector(".message")
    const BOARDCONTAINER = document.querySelector(".board-container")

    const displayBoard = function() {
        const board = gameBoard.getBoard(); 
        console.log(board.entries())
        for (const [i, value] of board.entries()) {
            console.log(`${i} and ${value}`)
            const cell = document.createElement("div");
            cell.textContent = value; 
            cell.className = "cell";
            cell.dataset.cell = i; 
            BOARDCONTAINER.append(cell)
        }
    }

    const updateDisplay = function(cellIndex, value) {
        const cell = BOARDCONTAINER.querySelector(`[data-cell='${cellIndex}']`);
        console.log(cell)

        if (cell) {
            cell.textContent = value;
        }
    }

    displayBoard()

    return {
        updateDisplay
    }
})();