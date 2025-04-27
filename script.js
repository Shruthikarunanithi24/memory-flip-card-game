const board = document.getElementById('gameBoard');
const message = document.getElementById('message');
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer = 0;
let timerInterval;
const size = 16; // 4x4

function init() {
  const symbols = ['🍎', '🍌', '🍇', '🍒', '🥝', '🍉', '🍍', '🍑'];
  const cardValues = [...symbols, ...symbols];
  cardValues.sort(() => 0.5 - Math.random());
  cards = [];

  for (let i = 0; i < size; i++) {
    cards.push({
      value: cardValues[i],
      flipped: false,
      solved: false
    });
  }
  
  drawBoard();
  startTimer();
}

function drawBoard() {
  board.innerHTML = '';
  cards.forEach((card, idx) => {
    const div = document.createElement('div');
    div.className = 'card';
    if (card.flipped || card.solved) {
      div.textContent = card.value;
    }
    div.addEventListener('click', () => flipCard(idx));
    board.appendChild(div);
  });
}

function flipCard(index) {
  const card = cards[index];
  if (card.flipped || card.solved || flippedCards.length >= 2) return;

  card.flipped = true;
  flippedCards.push(index);
  drawBoard();

  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 1000);
  }
}

function checkMatch() {
  const [firstIdx, secondIdx] = flippedCards;
  if (cards[firstIdx].value === cards[secondIdx].value) {
    cards[firstIdx].solved = true;
    cards[secondIdx].solved = true;
    matchedPairs++;
    if (matchedPairs === 8) {
      clearInterval(timerInterval);
      message.innerText = "🎉 You won in " + timer + " seconds!";
    }
  } else {
    cards[firstIdx].flipped = false;
    cards[secondIdx].flipped = false;
  }
  flippedCards = [];
  drawBoard();
}

function startTimer() {
  timer = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById('timer').innerText = `Time: ${timer}s`;
  }, 1000);
}

function hint() {
  const unmatched = cards.map((card, idx) => !card.solved ? {value: card.value, idx} : null).filter(v => v);
  for (let i = 0; i < unmatched.length; i++) {
    for (let j = i + 1; j < unmatched.length; j++) {
      if (unmatched[i].value === unmatched[j].value) {
        cards[unmatched[i].idx].flipped = true;
        cards[unmatched[j].idx].flipped = true;
        drawBoard();
        setTimeout(() => {
          cards[unmatched[i].idx].flipped = false;
          cards[unmatched[j].idx].flipped = false;
          drawBoard();
        }, 1000);
        return;
      }
    }
  }
}

function showSolution() {
  cards.forEach(card => card.flipped = true);
  drawBoard();
}

function restart() {
  clearInterval(timerInterval);
  matchedPairs = 0;
  flippedCards = [];
  message.innerText = "";
  init();
}

window.onload = init;
