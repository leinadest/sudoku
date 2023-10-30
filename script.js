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

function createCell() {
    const cell = document.createElement('div');
    cell.classList.add('cell');
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

function setBoard() {
    const board = document.querySelector('.board');
    for (let i = 0; i < 9; i++) {
        board.children[i].replaceChildren();
        for (let j = 0; j < 9; j++) {
            board.children[i].appendChild(createCell());
        }
    }
}

function generateArrayBoard(difficulty) {
    const board = document.querySelector('.board');
    let generationIsValid;
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
    setBoard();
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

setBoard();
document.querySelector('.easy').addEventListener('click', e => generateBoard('easy'));
document.querySelector('.medium').addEventListener('click', e => generateBoard('medium'));
document.querySelector('.hard').addEventListener('click', e => generateBoard('hard'));