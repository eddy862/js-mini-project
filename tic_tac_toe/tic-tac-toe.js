document.querySelector('.js-start-button').addEventListener('click', ()=>startGame());

document.querySelectorAll('.js-box').forEach((box, index)=>{
  box.addEventListener('click', ()=>playerClick(index));
})

let p1 = 0;
let p2 = 0;
let tie = 0;

let storeState = [0, 0, 0, 
  0, 0, 0, 
  0, 0, 0];

let winCombination = '';
let num = 0;

//avoid accumulate score after result is out
let renderScore = true;

function startGame() {
  playAudio('button');
  playerClick();
}
  
function playerClick(index) {
  const symbol = document.querySelectorAll('.js-box-img');
  //prevent change the symbol when the box already has one
  //prevent add symbol when any player wins
  if (storeState[index] === 0 && !showResultAndRestart()) {
    symbol[index].classList.add('active');
    num++;
    if (num % 2 != 0) {
      playAudio('playerMove1');
      storeState[index] += 1;
    } else {
      playAudio('playerMove2');
      storeState[index] += 2;
    }
  }

  indicatePlayerMove();
  showResultAndRestart();
  winAnimation();
  displaySymbol();
  if (renderScore) {displayScore();}
}

function displaySymbol() {
  storeState.forEach((value, index)=>{
    const symbol = document.querySelectorAll('.js-box-img')[index];
    if (value === 0) {
      symbol.src = '';
    }
    if (value === 1) {
      symbol.src = 'assets/cross.png';
    } 
    if (value === 2) {
      symbol.src = "assets/circle.png";
    }
  })
}

function displayScore() {
  const message = document.querySelector('.js-message');
  if (showResultAndRestart()) {
    switch(message.innerHTML) {
      case 'Player 1 win!':
        playAudio('win');
        p1++;
        document.querySelector('.js-p1-score').classList.add('score-ani');
        break;
      case 'Player 2 win!':
        playAudio('win');
        p2++;
        document.querySelector('.js-p2-score').classList.add('score-ani');
        break;
      case 'Draw!':
        playAudio('draw');
        tie++;
        document.querySelector('.js-tie-score').classList.add('score-ani');
        break;
    }
    renderScore = false;
  }

  document.querySelector('.js-p1-score').innerHTML = p1;
  document.querySelector('.js-p2-score').innerHTML = p2;
  document.querySelector('.js-tie-score').innerHTML = tie;
}

function indicatePlayerMove() {
  const playerMove = document.querySelector('.js-player-move-result');
  if (num % 2 != 0) {
    playerMove.innerHTML = 'Player 2 Move!';
  } else {
    playerMove.innerHTML = 'Player 1 Move!';
  }
}

function showResultAndRestart() {
  const result = handleResult();
  const restartBox = document.querySelector('.js-player-move-result');
  let message = '';
  
  if (result !== '') {
    message = result;
  } else if (!storeState.includes(0)) {
    message = 'Draw!';
  } else {
    return; 
  }
  
  restartBox.innerHTML = `<div class='js-message'>${message}</div>
    <div class='button-flex'>
      <button class="js-start-button">Play Again</button>
      <button class='reset-button js-reset-button'>Reset Score</button>
    </div>`;

  document.querySelector('.js-start-button').addEventListener('click', () => nextRound());
  document.querySelector('.js-reset-button').addEventListener('click', ()=>{
    p1 = 0;
    p2 = 0;
    tie = 0;
    nextRound();
    displayScore();
  })

  return true;
}

function handleResult() {
  let result = '';
  
  function checkThreeValues(a, b, c) {
    return a !== 0 && a === b && b === c;
  }

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]            // Diagonals
  ];

  for (const com of winningCombinations) {
    const [a, b, c] = com;
    if (checkThreeValues(storeState[a], storeState[b], storeState[c])) {
      if (num % 2 != 0) {
        result = 'Player 1 win!';
      } 
      if (num % 2 === 0) {
        result = 'Player 2 win!';
      }
    } 
  }
  
  return result;
}

function winAnimation() {
  if (winCombination != '') {
    for (let i = 0; i < 3; i++) {
      const index = winCombination[i]; 
      document.querySelectorAll('.js-box-img')[index].classList.add('win');
    }

  winCombination = '';
  }
}

function nextRound() {
  playAudio('button');

  storeState = [0, 0, 0, 
    0, 0, 0, 
    0, 0, 0];
  num = 0;
  winCombination = '';
  renderScore = true;

  document.querySelectorAll('.js-box-img').forEach((img)=>{
    img.classList.remove('active');
    img.classList.remove('win');
  document.querySelector('.js-p1-score').classList.remove('score-ani');
  document.querySelector('.js-p2-score').classList.remove('score-ani');
  document.querySelector('.js-tie-score').classList.remove('score-ani');
  });

  displaySymbol();
  indicatePlayerMove();
}

function playAudio(audio) {
  const newAudio = new Audio(`assets/${audio}.mp3`);

  if(!newAudio.paused) {
    newAudio.pause();
    newAudio.currentTime = 0;
  }

  newAudio.play();
}