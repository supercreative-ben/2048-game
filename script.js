const GRID_SIZE = 5;
const grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
const tileContainer = document.querySelector('.tile-container');
const scoreDisplay = document.getElementById('score');
let score = 0;

function createTiles() {
    // Clear existing tiles
    tileContainer.innerHTML = '';
    
    // Create exactly GRID_SIZE * GRID_SIZE tiles
    const totalTiles = GRID_SIZE * GRID_SIZE;
    for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-value', '');
        tileContainer.appendChild(tile);
    }
}

function updateDisplay() {
    const tiles = document.querySelectorAll('.tile');
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const index = i * GRID_SIZE + j;
            const value = grid[i][j];
            tiles[index].textContent = value || '';
            tiles[index].setAttribute('data-value', value || '');
        }
    }
    scoreDisplay.textContent = score;
}

function addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({i, j});
            }
        }
    }
    if (emptyCells.length > 0) {
        const {i, j} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
}

function move(direction) {
    let moved = false;
    const tempGrid = grid.map(row => [...row]);

    if (direction === 'left') {
        // Move left
        for (let i = 0; i < GRID_SIZE; i++) {
            let row = grid[i].filter(cell => cell !== 0);
            
            // Merge
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    score += row[j];
                    row.splice(j + 1, 1);
                }
            }
            
            // Fill with zeros at the end
            while (row.length < GRID_SIZE) {
                row.push(0);
            }
            grid[i] = row;
        }
    } else if (direction === 'right') {
        // Move right
        for (let i = 0; i < GRID_SIZE; i++) {
            let row = grid[i].filter(cell => cell !== 0);
            
            // Merge from right to left
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    score += row[j];
                    row.splice(j - 1, 1);
                }
            }
            
            // Fill with zeros at the start
            while (row.length < GRID_SIZE) {
                row.unshift(0);
            }
            grid[i] = row;
        }
    } else if (direction === 'up') {
        // Move up
        for (let j = 0; j < GRID_SIZE; j++) {
            let col = grid.map(row => row[j]).filter(cell => cell !== 0);
            
            // Merge
            for (let i = 0; i < col.length - 1; i++) {
                if (col[i] === col[i + 1]) {
                    col[i] *= 2;
                    score += col[i];
                    col.splice(i + 1, 1);
                }
            }
            
            // Fill with zeros at the end
            while (col.length < GRID_SIZE) {
                col.push(0);
            }
            
            // Update the column in the grid
            for (let i = 0; i < GRID_SIZE; i++) {
                grid[i][j] = col[i];
            }
        }
    } else if (direction === 'down') {
        // Move down
        for (let j = 0; j < GRID_SIZE; j++) {
            let col = grid.map(row => row[j]).filter(cell => cell !== 0);
            
            // Merge from bottom to top
            for (let i = col.length - 1; i > 0; i--) {
                if (col[i] === col[i - 1]) {
                    col[i] *= 2;
                    score += col[i];
                    col.splice(i - 1, 1);
                }
            }
            
            // Fill with zeros at the start
            while (col.length < GRID_SIZE) {
                col.unshift(0);
            }
            
            // Update the column in the grid
            for (let i = 0; i < GRID_SIZE; i++) {
                grid[i][j] = col[i];
            }
        }
    }

    // Check if the grid changed
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] !== tempGrid[i][j]) {
                moved = true;
                break;
            }
        }
    }

    if (moved) {
        addNewTile();
        updateDisplay();
    }
}

function handleKeyPress(event) {
    if ([
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown'
    ].includes(event.key)) {
        // Prevent the page from scrolling when using arrow keys
        event.preventDefault();
    }

    switch(event.key) {
        case 'ArrowLeft':
            move('left');
            break;
        case 'ArrowRight':
            move('right');
            break;
        case 'ArrowUp':
            move('up');
            break;
        case 'ArrowDown':
            move('down');
            break;
    }
}

// Initialize game
createTiles();
document.addEventListener('keydown', handleKeyPress);
addNewTile();
addNewTile();
updateDisplay();
