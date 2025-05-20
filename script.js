const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

let boardState = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// Optional sound effects
const soundClick = new Audio('https://freesound.org/data/previews/256/256113_3263906-lq.mp3');
const soundWin   = new Audio('https://freesound.org/data/previews/331/331912_3248244-lq.mp3');
const soundDraw  = new Audio('https://freesound.org/data/previews/108/108651_945474-lq.mp3');

function playSound(sound) {
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

// Handle keyboard (Enter/Space = click)
function handleKeyPress(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    e.target.click();
  }
}

function handleCellClick(e) {
  const cell = e.target;
  const idx  = +cell.dataset.index;
  if (boardState[idx] || !gameActive) return;

  boardState[idx] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('marked');

  checkResult();
  playSound(soundClick);
}

function changePlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `Player ${currentPlayer}'s turn`;
}

function highlightWinningCells(line) {
  line.forEach(i => cells[i].classList.add('winner'));
}

function checkResult() {
  let roundWon = false, winLine = [];

  for (let cond of winningConditions) {
    const [a,b,c] = cond;
    if (!boardState[a] || !boardState[b] || !boardState[c]) continue;
    if (boardState[a] === boardState[b] && boardState[b] === boardState[c]) {
      roundWon = true;
      winLine = cond;
      break;
    }
  }

  if (roundWon) {
    status.textContent = `Player ${currentPlayer} wins! 🎉`;
    highlightWinningCells(winLine);
    gameActive = false;
    playSound(soundWin);
    return;
  }

  if (!boardState.includes('')) {
    status.textContent = `It's a draw! 🤝`;
    gameActive = false;
    playSound(soundDraw);
    return;
  }

  changePlayer();
}

function resetGame() {
  boardState.fill('');
  gameActive = true;
  currentPlayer = 'X';
  status.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(c => {
    c.textContent = '';
    c.classList.remove('marked', 'winner');
  });
  playSound(soundClick);
}

// Event binding
cells.forEach(c => {
  c.addEventListener('click', handleCellClick);
  c.addEventListener('keydown', handleKeyPress);
});
resetBtn.addEventListener('click', resetGame);
