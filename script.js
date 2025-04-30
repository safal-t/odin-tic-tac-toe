function createPlayer(marker) {

    if (marker !== "X" && marker !== "O") {
        throw new Error("Player marker can either be 'X' or 'O'.")
    }

    const getPlayerMarker = function() {
        return marker
    }

    const makeMove = function(cell) {
        gameController.manageMove(cell)
    }

    return {
        getPlayerMarker,
        makeMove
    }
}

const gameBoard = (function() {

    const board = [
        "", "", "",
        "", "", "",
        "", "", ""
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

    const playerX = createPlayer("X"); 
    const playerO = createPlayer("O");

    let currentPlayer = playerX;
    let winner = null;

    const manageMove = function(cellIndex) {
        validateMove(cellIndex)
        updateBoard(cellIndex)
        handleGameState();
        switchPlayer();
    }

    const validateMove = function(cellIndex) {
        if (gameBoard.getCell(cellIndex) !== "") {
            throw new Error("Invalid move: Cell is not empty");
        }
    };

    const updateBoard = function(cellIndex) {
        const marker = currentPlayer.getPlayerMarker(); 
        gameBoard.updateCell(cellIndex, marker);
        displayController.updateDisplay(cellIndex, marker)
    };

    const handleGameState = function() {
        checkForWinner();
        checkForTie();
    };

    const switchPlayer = function() {
        console.log(`${currentPlayer.getPlayerMarker()} is the current player before the switch`)
        currentPlayer = currentPlayer.getPlayerMarker() === "X" 
            ? playerO
            : playerX;
        console.log(`${currentPlayer.getPlayerMarker()} is the current player after the switch`)
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
        displayController.resetDisplay();
        winner = null;
        console.log("Game reset");
    };

    return {
        currentPlayer,
        manageMove,
        updateBoard,
    };

})();
                       
const displayController = (function() { 

    const MESSAGE = document.querySelector(".message")
    const BOARDCONTAINER = document.querySelector(".board-container")

    const displayBoard = function() {
        for (const [i, value] of gameBoard.getBoard().entries()) {
            console.log(`${i} and ${value}`)
            const cell = document.createElement("div");
            cell.textContent = value; 
            cell.className = "cell";
            cell.dataset.cell = i; 

            cell.addEventListener("click", () => { 
                gameController.manageMove(i)
            })

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

    const resetDisplay = function() {
        const cells = BOARDCONTAINER.querySelectorAll(".cell");
        const board = gameBoard.getBoard();

        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        })
    }

    displayBoard()

    return {
        updateDisplay,
        resetDisplay
    }
})();