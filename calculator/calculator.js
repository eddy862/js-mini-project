let calculation = localStorage.getItem('calculation') || '';
const textInput = document.querySelector('.js-calculation');

displayCalculation();

document.body.addEventListener('keydown', (event)=> {
  if (event.key === 'Enter') {
    playAudio('click');
    calculateResult();
  }
})

textInput.addEventListener('input', (event) => {
  playAudio('click');

  const InputValue = event.target.value;
  
  if (InputValue.includes('=')) {
    calculateResult();
  } else {
    calculation = String(InputValue);
    calculation = calculation.replace('Error', '');
  }

  error();

  if (calculation.length === 0) {
    calculation = '';
    displayResult();
  }

  displayCalculation(); 
  
  localStorage.setItem('calculation', calculation);
});

function error() {
  if (calculation.length > 19) {
    calculation = 'Error';
    playAudio('error');
  }
}

function calculateResult() { 
  calculation = String(textInput.value);
  calculation = calculation.replace('÷','/');
  calculation = calculation.replace('×','*');
  
  try {
    if (calculation === '' || calculation === 'Error') {
      calculation = '';
      playAudio('error');
    } else {
      calculation = String(eval(calculation));
    }
  } catch {
    calculation = 'Error'; 
    playAudio('error');
  }

  if (Math.floor(calculation).length > 12) {
    calculation = 'Error';
    playAudio('error');
  } else if (Math.floor(calculation) != calculation ) {
    calculation = calculation.slice(0, 12);
  }
  
  displayResult();

  localStorage.setItem('calculation', calculation);
}

function updateCalculation(value) {
  calculation = calculation.replace('Error', '');
  
  calculation += value;

  error();

  displayCalculation();
  
  localStorage.setItem('calculation', calculation);
}

function displayCalculation() {
  calculation = calculation.replace('/', '÷');
  calculation = calculation.replace('*', '×');
  textInput.value = calculation;
}

function displayResult() {
  const resultRow = document.querySelector('.result-row');
  resultRow.innerHTML = calculation;
}

function clr() {
  calculation = '';
            
  displayCalculation();
  displayResult();

  localStorage.setItem('calculation', calculation);
}

function backspace() {
  if (calculation === 'Error' || calculation === 'undefined') {
    calculation = '';
  }

  calculation = calculation.slice(0, -1);

  displayCalculation();
  if (calculation.length === 0) {
    displayResult();
  }
  
  localStorage.setItem('calculation', calculation);
}

const numButton = document.querySelectorAll('button');

for (const button of numButton) {
  button.addEventListener('click', ()=>{playAudio('click')})  
}

let soundOn = true;

function playAudio(audio) {
  if (soundOn === true) {
    const newAudio = new Audio(`calculator.sources/${audio}.mp3`);

    if(!newAudio.paused) {
      newAudio.pause();
      newAudio.currentTime = 0;
    }

    newAudio.play();
  } 
}

function handleSound() {
  const soundButton = document.querySelector('.sound-button');

  if(!soundOn === true) {
    soundOn = true;
    soundButton.innerHTML = '<img class="sound-icon" src="calculator.sources/mute.png">';
  } else {
    soundOn = false;
    soundButton.innerHTML = '<img class="sound-icon unmuted" src="calculator.sources/unmuted.png">';
  }
}