function createPlayer(name, marker) {

    if (marker !== "X" && marker !== "O") {
        displayController.displayMessage("Player marker can either be 'X' or 'O'.")
        throw new Error("Player marker can either be 'X' or 'O'.")
    }
    const playerName = name;

    const getName = () => name

    const getPlayerMarker = function() {
        return marker
    }

    const makeMove = function(cell) {
        gameController.manageMove(cell)
    }

    return {
        getName,
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
    }

    return {
        getBoard,
        getCell,
        updateCell,
        resetBoard,
    }
})(); 

const gameController = function() {

    let currentPlayer = null; 
    let winner = null;
    let gameOver = false;

    const startGame = function(playerX, playerO) {
        currentPlayer = playerX
        nextPlayer = playerO
    };

    const manageMove = function(cellIndex) {
        if (!currentPlayer) {
            displayController.displayMessage("Game has not started yet. Please enter player names.");
            return;
        }
        validateMove(cellIndex);
        updateBoard(cellIndex);
        handleGameState();
        if (!gameOver) {
            switchPlayer();
            displayController.displayMessage(`${currentPlayer.getName()}'s turn`);
        }
    };

    const validateMove = function(cellIndex) {
        if (gameBoard.getCell(cellIndex) !== "") {
            displayController.displayMessage("Invalid move: Cell is not empty");
            throw new Error("Invalid move: Cell is not empty");
        }
    };

    const updateBoard = function(cellIndex) {
        const marker = currentPlayer.getPlayerMarker();
        gameBoard.updateCell(cellIndex, marker);
        displayController.updateDisplay(cellIndex, marker);
    };

    const handleGameState = function() {
        checkForWinner();
        checkForTie();
    };

    const switchPlayer = function() {
        const temp = currentPlayer
        currentPlayer = nextPlayer
        nextPlayer = temp;
    }

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
                declareWinner(currentPlayer);
            }
        }
    };

    const declareWinner = function(winner) {
        displayController.displayMessage(`The winner is ${winner.getName()}`);
        gameOverFunc()
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
        displayController.displayMessage("The game is tied");
        gameOverFunc()
    };

    const resetGame = function() {
        gameBoard.resetBoard();
        displayController.resetDisplay();
        winner = null;
        displayController.displayMessage("Game reset");
    };

    const gameOverFunc = function() {
        gameOver = true;
        document.querySelectorAll(".board-container .cell").forEach(cell => {
            cell.style.pointerEvents = "none";
        });
        displayController.gameOver()
    }

    return {
        startGame, 
        manageMove,
        updateBoard,
    };

};

const gameControllerInstance = gameController();
                       
const displayController = (function() { 

    const MESSAGE = document.querySelector(".message")
    const BOARDCONTAINER = document.querySelector(".board-container")
    const FORM = document.querySelector("form")
    const BODY = document.querySelector("body");

    gameActive = false;
    playerX = null;
    playerO = null;

    FORM.addEventListener("submit", (event) => {
        event.preventDefault();
        playerX = createPlayer(FORM.querySelector("#playerX-name").value, "X");
        playerO = createPlayer(FORM.querySelector("#playerO-name").value, "O");
        gameActive = true;
        gameControllerInstance.startGame(playerX, playerO); 
        displayMessage("Game Started");
        FORM.style.display = "none";
        const h3X = document.createElement("h3");
        const h3O = document.createElement("h3");
        h3X.textContent = `PlayerX: ${playerX.getName()}`
        h3O.textContent = `PlayerO: ${playerO.getName()}`
        BODY.append(h3X, h3O)
    
    });

    const displayBoard = function() {
        for (const [i, value] of gameBoard.getBoard().entries()) {
            const cell = document.createElement("div");
            cell.textContent = value; 
            cell.className = "cell";
            cell.dataset.cell = i; 
    
            cell.addEventListener("click", () => { 
                if (gameActive) {
                    gameControllerInstance.manageMove(i);
                } else {
                    displayMessage("Please enter player names")
                }
            })
    
            BOARDCONTAINER.append(cell)
        }
    };

    const updateDisplay = function(cellIndex, value) {
        const cell = BOARDCONTAINER.querySelector(`[data-cell='${cellIndex}']`);

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

    const displayMessage = function(message) {
        MESSAGE.textContent = message; 
    }
    
    const gameOver = function() {
        const resetButton = document.createElement("button");
        resetButton.textContent = "Restart Game";
        resetButton.className = "reset-button";
        resetButton.addEventListener("click", () => {
            location.reload();
        });
        BODY.append(resetButton);
    }

    displayBoard()

    return {
        updateDisplay,
        resetDisplay,
        displayMessage,
        playerX,
        playerO,
        gameOver
    }

})();

