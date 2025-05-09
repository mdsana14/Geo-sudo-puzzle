const startFixedBtn = document.getElementById('startFixed');
const startRandomBtn = document.getElementById('startRandom');
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const grid = document.getElementById('grid');
const options = document.getElementById('options');
const scoreboard = document.getElementById('scoreboard');
const leaderboard = document.getElementById('leaderboard');
const nextPuzzleBtn = document.getElementById('nextPuzzle');
const exitGameBtn = document.getElementById('exitGame');
const retryBtn = document.getElementById('retry');
const feedback = document.getElementById('feedback');

let currentPuzzle = 0;
let score = 0;

let lastPuzzle = null;
let isLastFixed = false;

const shapes = ["+", "◯", "▲", "■", "✦"];

const fixedPuzzles = [
  {
    size: 3,
    grid: [
      ["◯", "▲", "+"],
      ["▲", "?", "◯"],
      ["+", "◯", "▲"]
    ],
    answer: "+"
  },
  {
    size: 3,
    grid: [
      ["+", "◯", "▲"],
      ["◯", "▲", "+"],
      ["▲", "+", "?"]
    ],
    answer: "◯"
  },
  {
    size: 4,
    grid: [
      ["◯", "+", "▲", "■"],
      ["▲", "■", "+", "◯"],
      ["+", "◯", "■", "▲"],
      ["■", "▲", "◯", "?"]
    ],
    answer: "+"
  },
  {
    size: 4,
    grid: [
      ["▲", "■", "◯", "+"],
      ["◯", "+", "▲", "■"],
      ["+", "◯", "■", "▲"],
      ["■", "▲", "+", "?"]
    ],
    answer: "◯"
  },
  {
    size: 4,
    grid: [
      ["+", "■", "◯", "▲"],
      ["◯", "▲", "+", "■"],
      ["▲", "◯", "■", "+"],
      ["■", "+", "▲", "?"]
    ],
    answer: "◯"
  },
  {
    size: 5,
    grid: [
      ["✦", "+", "▲", "◯", "■"],
      ["◯", "✦", "+", "■", "▲"],
      ["+", "◯", "■", "▲", "✦"],
      ["▲", "■", "✦", "+", "◯"],
      ["■", "▲", "◯", "✦", "?"]
    ],
    answer: "+"
  },
  {
    size: 5,
    grid: [
      ["✦", "◯", "■", "+", "▲"],
      ["◯", "▲", "+", "✦", "■"],
      ["+", "■", "▲", "◯", "✦"],
      ["■", "+", "✦", "▲", "◯"],
      ["▲", "✦", "◯", "■", "?"]
    ],
    answer: "+"
  },
  {
    size: 3,
    grid: [
      ["◯", "+", "▲"],
      ["▲", "◯", "+"],
      ["+", "▲", "?"]
    ],
    answer: "◯"
  },
  {
    size: 4,
    grid: [
      ["✦", "◯", "+", "▲"],
      ["◯", "+", "▲", "✦"],
      ["+", "▲", "✦", "◯"],
      ["▲", "✦", "◯", "?"]
    ],
    answer: "+"
  },
  
  {
    size: 4,
    grid: [
      ["◯", "+", "▲", "■"],
      ["▲", "■", "◯", "+"],
      ["+", "▲", "■", "◯"],
      ["■", "◯", "+", "?"]
    ],
    answer: "▲"
  },
  {
    size: 3,
    grid: [
      ["■", "+", "◯"],
      ["+", "◯", "■"],
      ["◯", "■", "?"]
    ],
    answer: "+"
  }
  
];

function startGame(isFixed) {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  loadPuzzle(isFixed);
}

startFixedBtn.onclick = () => startGame(true);
startRandomBtn.onclick = () => startGame(false);
exitGameBtn.onclick = () => location.reload();
nextPuzzleBtn.onclick = () => loadPuzzle(false);
retryBtn.onclick = () => loadPuzzle(isLastFixed, true);

function loadPuzzle(isFixed, retry = false) {
  options.innerHTML = '';
  grid.innerHTML = '';
  feedback.innerText = '';

  let puzzle;

  if (retry && lastPuzzle) {
    puzzle = lastPuzzle;
    isFixed = isLastFixed;
  } else {
    puzzle = isFixed ? fixedPuzzles[currentPuzzle++] : generateRandomPuzzle();
    if (currentPuzzle >= fixedPuzzles.length) currentPuzzle = 0;
    lastPuzzle = puzzle;
    isLastFixed = isFixed;
  }

  const size = puzzle.size;
  grid.style.gridTemplateColumns = `repeat(${size}, 60px)`;

  puzzle.grid.forEach(row => {
    row.forEach(cellValue => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (cellValue) cell.innerText = cellValue;
      grid.appendChild(cell);
    });
  });

  const shapeOptions = shapes.slice(0, size);
  const shuffled = [...shapeOptions].sort(() => Math.random() - 0.5);
  if (!shuffled.includes(puzzle.answer)) {
    shuffled[Math.floor(Math.random() * size)] = puzzle.answer;
  }

  shuffled.forEach(shape => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.innerText = shape;
    btn.onclick = () => {
      if (shape === puzzle.answer) {
        score += 10;
        scoreboard.innerText = `Score: ${score}`;
        leaderboard.innerText = `Leaderboard: ${score}`;
        feedback.innerText = "✅ Correct!";
        feedback.style.color = "green";
        confettiBlast();
      } else {
        feedback.innerText = "❌ Wrong! Try Again.";
        feedback.style.color = "red";
      }
    };
    options.appendChild(btn);
  });
}

function generateRandomPuzzle() {
  const size = 3 + Math.floor(Math.random() * 3);
  const symbols = shapes.slice(0, size);

  let base = [];
  for (let i = 0; i < size; i++) {
    let row = symbols.slice(i).concat(symbols.slice(0, i));
    base.push(row);
  }

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
  const rowOrder = shuffle([...Array(size).keys()]);
  const colOrder = shuffle([...Array(size).keys()]);

  let grid = Array(size).fill().map(() => Array(size).fill(""));
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      grid[i][j] = base[rowOrder[i]][colOrder[j]];
    }
  }

  const qi = Math.floor(Math.random() * size);
  const qj = Math.floor(Math.random() * size);
  const answer = grid[qi][qj];
  grid[qi][qj] = "?";

  let hidden = 0;
  while (hidden < 3 + Math.floor(Math.random() * 3)) {
    const i = Math.floor(Math.random() * size);
    const j = Math.floor(Math.random() * size);
    if ((i === qi && j === qj) || grid[i][j] === "") continue;
    grid[i][j] = "";
    hidden++;
  }

  return { size, grid, answer };
}

function confettiBlast() {
  const duration = 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

const confettiScript = document.createElement('script');
confettiScript.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
document.body.appendChild(confettiScript);
