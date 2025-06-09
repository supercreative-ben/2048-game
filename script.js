const GRID_SIZE = 5;
const CELL_SIZE = 80;
const CELL_GAP = 10;

const gridContainer = document.getElementById('grid-container');
const tileContainer = document.getElementById('tile-container');
const scoreDisplay = document.getElementById('score');

let grid = [];
let tiles = []; // {row, col, value, element, merged}
let score = 0;

function createGrid() {
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gridContainer.appendChild(cell);
  }
}

function positionTile(el, row, col) {
  const x = col * (CELL_SIZE + CELL_GAP);
  const y = row * (CELL_SIZE + CELL_GAP);
  el.style.transform = `translate(${x}px, ${y}px)`;
}

function createTile(value, row, col) {
  const div = document.createElement('div');
  div.classList.add('tile');
  div.textContent = value;
  div.dataset.value = value;
  positionTile(div, row, col);
  tileContainer.appendChild(div);
  return { row, col, value, element: div };
}

function spawnTile() {
  const empty = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) empty.push({ i, j });
    }
  }
  if (!empty.length) return;
  const { i, j } = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  grid[i][j] = value;
  tiles.push(createTile(value, i, j));
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function resetGrid() {
  grid = Array(GRID_SIZE)
    .fill()
    .map(() => Array(GRID_SIZE).fill(0));
}

function move(direction) {
  tiles.forEach((t) => {
    delete t.merged;
    delete t.toRemove;
  });

  let moved = false;

  if (direction === 'left' || direction === 'right') {
    const reverse = direction === 'right';
    for (let i = 0; i < GRID_SIZE; i++) {
      const rowTiles = tiles
        .filter((t) => t.row === i)
        .sort((a, b) => (reverse ? b.col - a.col : a.col - b.col));
      let target = reverse ? GRID_SIZE - 1 : 0;
      let last = null;
      rowTiles.forEach((tile) => {
        if (last && tile.value === last.value && !last.merged) {
          last.value *= 2;
          last.merged = true;
          score += last.value;
          tile.toRemove = true;
          tile.targetRow = i;
          tile.targetCol = last.targetCol;
          moved = moved || tile.col !== last.targetCol;
        } else {
          tile.targetRow = i;
          tile.targetCol = target;
          moved = moved || tile.col !== target;
          last = tile;
          target += reverse ? -1 : 1;
        }
      });
    }
  } else if (direction === 'up' || direction === 'down') {
    const reverse = direction === 'down';
    for (let j = 0; j < GRID_SIZE; j++) {
      const colTiles = tiles
        .filter((t) => t.col === j)
        .sort((a, b) => (reverse ? b.row - a.row : a.row - b.row));
      let target = reverse ? GRID_SIZE - 1 : 0;
      let last = null;
      colTiles.forEach((tile) => {
        if (last && tile.value === last.value && !last.merged) {
          last.value *= 2;
          last.merged = true;
          score += last.value;
          tile.toRemove = true;
          tile.targetRow = last.targetRow;
          tile.targetCol = j;
          moved = moved || tile.row !== last.targetRow;
        } else {
          tile.targetRow = target;
          tile.targetCol = j;
          moved = moved || tile.row !== target;
          last = tile;
          target += reverse ? -1 : 1;
        }
      });
    }
  }

  if (!moved) return;

  resetGrid();

  tiles.forEach((tile) => {
    if (!tile.toRemove) {
      tile.row = tile.targetRow;
      tile.col = tile.targetCol;
      grid[tile.row][tile.col] = tile.value;
    }
    positionTile(tile.element, tile.targetRow, tile.targetCol);
    if (tile.toRemove) {
      tile.element.addEventListener(
        'transitionend',
        () => tile.element.remove(),
        { once: true }
      );
    } else {
      tile.element.dataset.value = tile.value;
      tile.element.textContent = tile.value;
    }
  });

  tiles = tiles.filter((t) => !t.toRemove);

  setTimeout(() => {
    spawnTile();
    updateScore();
  }, 150);
}

function handleKeyPress(event) {
  switch (event.key) {
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

function init() {
  resetGrid();
  createGrid();
  spawnTile();
  spawnTile();
  updateScore();
}

document.addEventListener('keydown', handleKeyPress);
init();
