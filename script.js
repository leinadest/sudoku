let cells = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let userActionHistory = {
    history : [{
        cell : undefined,
        move : undefined
    }],
    present : 0
}

let selectedCell;
let timerInterval;

function createCell() {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', e => {
        if (selectedCell != undefined) {
            selectedCell.style.backgroundColor = 'white';
        }
        cell.style.backgroundColor = 'lightblue';
        selectedCell = cell;
    });
    return cell;
}

function checkRow(row, col) {
    for (let i = 0; i < 9; i++) {
        if (col == i) {
            continue;
        }
        if (cells[row][col] == cells[row][i]) {
            return false;
        }
    }
    return true;
}

function checkCol(row, col) {
    for (let i = 0; i < 9; i++) {
        if (row == i) {
            continue;
        }
        if (cells[row][col] == cells[i][col]) {
            return false;
        }
    }
    return true;
}

function checkSubgrid(row, col) {
    let subgridRow = 0;
    let subgridCol = 0;
    let x = row;
    let y = col;
    while (x > 2) {
        x -= 3;
        subgridRow++;
    }
    while (y > 2) {
        y -= 3;
        subgridCol++;
    }
    for (let i = subgridRow*3; i < 3+subgridRow*3; i++) {
        for (let j = subgridCol*3; j < 3+subgridCol*3; j++) {
            if (row == i && col == j) {
                continue;
            }
            if (cells[row][col] == cells[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function createCleanBoard() {
    const board = document.querySelector('.board');
    for (let i = 0; i < 9; i++) {
        board.children[i].replaceChildren();
        for (let j = 0; j < 9; j++) {
            board.children[i].appendChild(createCell());
            cells[i][j] = 0;
        }
    }
}

function generateArrayBoard(difficulty) {
    let generationIsValid = true;
    do {
        generationIsValid = true;
        generation: for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let cellValueIsAvailable = false;
                let values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                do {
                    const valuesIndex = parseInt(Math.random()*values.length);
                    cells[row][col] = values[valuesIndex];
                    values.splice(valuesIndex, 1);
                    cellValueIsAvailable = checkRow(row, col) && checkCol(row, col) && checkSubgrid(row, col);
                } while (!cellValueIsAvailable && values.length > 0); 
                if (!cellValueIsAvailable) {
                    for (let i = 0; i < 9; i++) {
                        for (let j = 0; j < 9; j++) {
                            cells[i][j] = 0;
                        }
                    }
                    generationIsValid = false;
                    break generation;
                }
            }
        }
    } while (generationIsValid == false);
}

function generateBoard(difficulty) {
    const board = document.querySelector('.board');
    createCleanBoard();
    generateArrayBoard(difficulty);
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cellDOMIndex = col%3 + (row%3)*3;
            let cellDOM;
            if (row < 3) {
                if (col < 3) {
                    cellDOM = board.children[0].children[cellDOMIndex];
                } else if (col < 6) {
                    cellDOM = board.children[1].children[cellDOMIndex];
                } else {
                    cellDOM = board.children[2].children[cellDOMIndex];
                }
            } else if (row < 6) {
                if (col < 3) {
                    cellDOM = board.children[3].children[cellDOMIndex];
                } else if (col < 6) {
                    cellDOM = board.children[4].children[cellDOMIndex];
                } else {
                    cellDOM = board.children[5].children[cellDOMIndex];
                }
            } else if (row < 9) {
                if (col < 3) {
                    cellDOM = board.children[6].children[cellDOMIndex];
                } else if (col < 6) {
                    cellDOM = board.children[7].children[cellDOMIndex];
                } else {
                    cellDOM = board.children[8].children[cellDOMIndex];
                }
            }
            cellDOM.classList.add(cells[row][col]);
            if (
                difficulty == 'easy' && Math.random() > 0.5 || 
                difficulty == 'medium' && Math.random() > 0.6 ||
                difficulty == 'hard' && Math.random() > 0.7
            ) {
                cellDOM.textContent = cells[row][col];
            }
        }
    }
}

function updateHistory(newCell) {
    while (userActionHistory.present < userActionHistory.history.length - 1) {
        userActionHistory.history.pop();
    }
    userActionHistory.history.push({cell: newCell, move: newCell.textContent});
    userActionHistory.present++;
}

function checkBoardIsComplete() {
    let correctMoves = 0;
    let wrongMoves = 0;
    for (let subgridIndex = 0; subgridIndex < 9; subgridIndex++) {
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            const cell = document.querySelector('.board').children[subgridIndex].children[cellIndex];
            if (cell.textContent == '') {
                return;
            }
            if (cell.style.color == 'red') {
                wrongMoves++;
            }
            if (cell.style.color == 'green') {
                correctMoves++;
            }
        }
    }
    clearInterval(timerInterval);
    if (wrongMoves == 0) {
        window.alert(`
            You have won!
            Number of correct moves: ${correctMoves}
            Number of wrong moves: ${wrongMoves}
            Time: ${document.querySelector('.timer').textContent}
        `);
    } else {
        window.alert(`
            You have lost!
            Number of correct moves: ${correctMoves}
            Number of wrong moves: ${wrongMoves}
            Time: ${document.querySelector('.timer').textContent}
        `);
    }
}

function inputUserMove(move, cell) {
    if (cell.textContent != '') {
        return;
    }
    cell.textContent = move;
    if (cell.textContent == cell.classList.item(1)) {
        cell.style.color = 'green';
    } else {
        cell.style.color = 'red';
    }
    updateHistory(cell);
    checkBoardIsComplete();
}

function updateTimer() {
    let timer = document.querySelector('.timer');
    let time = timer.textContent.split(':').map(t => parseInt(t));
    time[2]++;
    if (time[2] > 59) {
        time[1]++;
        time[2] = 0;
    }
    if (time[1] > 59) {
        time[0]++;
        time[1] = 0;
    }
    timer.textContent = `${time[0]}:${time[1].toString().padStart(2, '0')}:${time[2].toString().padStart(2, '0')}`;
}

function startRound(difficulty) {
    generateBoard(difficulty);
    document.querySelector('.timer').textContent = '0:00:00';
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

createCleanBoard();
document.querySelector('.easy').addEventListener('click', e => startRound('easy'));
document.querySelector('.medium').addEventListener('click', e => startRound('medium'));
document.querySelector('.hard').addEventListener('click', e => startRound('hard'));

for (let i = 0; i < 9; i++) {
    const numberBtn = document.querySelector('.numbers').children[i];
    numberBtn.addEventListener('click', e => inputUserMove(e.target.textContent, selectedCell));
}

document.querySelector('.undo').addEventListener('click', e => {
    if (userActionHistory.present == 0) {
        return;
    }
    let previousCell = userActionHistory.history[userActionHistory.present].cell;
    previousCell.textContent = '';
    userActionHistory.present--;
});

document.querySelector('.redo').addEventListener('click', e => {
    if (userActionHistory.present == userActionHistory.history.length - 1) {
        return;
    }
    let nextHistory = userActionHistory.history[userActionHistory.present + 1];
    nextHistory.cell.textContent = nextHistory.move;
    userActionHistory.present++;
});

document.addEventListener('keydown', e => {
    const numberPressed = e.key.match(/[1-9]/);
    if (numberPressed != null) {
        inputUserMove(numberPressed, selectedCell);
    }
});

document.querySelector('.solve').addEventListener('click', e => {
    for (let subgridIndex = 0; subgridIndex < 9; subgridIndex++) {
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            const cell = document.querySelector('.board').children[subgridIndex].children[cellIndex];
            cell.textContent = cell.classList.item(1);
            cell.style.color = 'green';
            updateHistory(cell);
        }
    }
})