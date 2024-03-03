let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  loses: 0,
  ties: 0 
};

updateScore();

const pickComputerMove = function pickComputerMove() {
  const random = Math.random();
  if (random <= 1/3) {
    computer = 'rock'
  } else if (random > 1/3 && random <= 2/3) {
    computer = 'paper'
  } else {
    computer = 'scissors'
  }

  return computer;
}

function updateScore() {
  const scoreElement = document.querySelector('.js-score');
  scoreElement.innerHTML = `Wins: ${score.wins}. Losses: ${score.loses}. Ties: ${score.ties}.`;
}

function clearPage() {
  const result_ = document.querySelector('.js-result');
  const move = document.querySelector('.move-container');
  result_.innerHTML = '';
  move.innerHTML = '';
}

function playGame(playerMove) {
  const computer = pickComputerMove();
  let result = '';

  if (playerMove == 'scissors') {
    switch(computer) {
      case 'rock':
        result = 'You lost.';
        break;
      case 'paper':
        result = 'You win.';
        break;
      case 'scissors':
        result = 'Tie.';
        break;
    }
  }

  if (playerMove == 'paper') {
    switch(computer) {
      case 'rock':
        result = 'You win.';
        break;
      case 'paper':
        result = 'Tie.';
        break;
      case 'scissors':
        result = 'You lose.';
        break;
    }
  } 

  if (playerMove == 'rock') {
    switch(computer) {
      case 'rock':
        result = 'Tie.';
        break;
      case 'paper':
        result = 'You lose.';
        break;
      case 'scissors':
        result = 'You win.';
        break;
    }
  }

  switch(result) {
    case 'You win.':
      score.wins += 1;
      break;
    case 'You lose.':
      score.loses += 1;
      break;
    case 'Tie.':
      score.ties += 1;
      break;
  }

  localStorage.setItem('score', JSON.stringify(score));

  setTimeout(()=>updateScore(), 1000);

  const result_ = document.querySelector('.js-result');
  const move = document.querySelector('.move-container');
  const moveButton = document.querySelectorAll('.move-button');

  setTimeout(()=>{
    result_.innerHTML = 'Waiting for computer to choose...';
    move.innerHTML = `<div>You<img class="move-icon" src="rps_sources/${playerMove}.png"></div>
<div class="com-move"><img class="move-icon" src="rps_sources/${computer}.png">
Computer</div>`;

    moveButton.forEach((button) => {
      button.style.cursor = 'not-allowed';
      button.removeEventListener('click', pickComputerMove);
    })
    
    setTimeout(()=>{
      moveButton.forEach((button) => {
        button.style.cursor = 'pointer';
        button.addEventListener('click', pickComputerMove);
      })

      const comMove = document.querySelector('.com-move');
      result_.innerHTML = result;
      comMove.style.opacity = '1';
    }, 1000) 
  }, 0);
}

let autoPlayStart;

function autoPlay() {
  const autoPlayButton = document.querySelector('.autoplay-button');
  const result_ = document.querySelector('.js-result');
  const move = document.querySelector('.move-container');
  
  if (autoPlayButton.innerHTML === 'Auto Play') {
    autoPlayButton.innerHTML = 'Stop Play';
    result_.innerHTML = 'Activating Auto Play...';
    move.innerHTML = '';
    autoPlayStart = setInterval(()=>{
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1500)

  } else {
    autoPlayButton.innerHTML = 'Auto Play';
    clearInterval(autoPlayStart);
  }
}

document.body.addEventListener('keydown', (event)=>{
  if (event.key === 'r') {
    playGame('rock');
  }
  if (event.key === 'p') {
    playGame('paper');
  }
  if (event.key === 's') {
    playGame('scissors');
  }
});

document.querySelector('.rock-button').addEventListener('click', ()=>{
  playGame('rock');
});
document.querySelector('.paper-button').addEventListener('click', ()=>{
  playGame('paper');
});
document.querySelector('.scissors-button').addEventListener('click', ()=>{
  playGame('scissors');
});

document.querySelector('.reset-button').addEventListener('click', ()=>{
  score.wins = 0;
  score.loses = 0;
  score.ties = 0;
  localStorage.removeItem('score');
  updateScore();
  clearPage();
});

document.querySelector('.autoplay-button').addEventListener('click', ()=>{
  autoPlay();
});