let sec = 0;
let min = 0;
let mil = 0;

let runMil;

let runTimer = false;

function startCount() {
  runTimer = true;
  runMil = setInterval(()=>{
    mil++;
    if (mil > 99) {
      mil = 0;
      sec++;
    }
    if (sec > 59) {
      sec = 0;
      min++;
    }
    if (min > 59) {
      return
    }
    renderTimer();
  }, 10);
}

function stopCount() {
  runTimer = false;
  clearInterval(runMil);
}

function handleStartStop() {
  const startStopButton = document.querySelector('.js-start-button');
  const resetRecordButton = document.querySelector('.js-reset-button');

  if (!runTimer) {
    startCount();
    resetRecordButton.style.display = 'inline';
    startStopButton.innerHTML = 'Stop';
    resetRecordButton.innerHTML = 'Record';
  } else {
    stopCount();
    startStopButton.innerHTML = 'Start';
    resetRecordButton.innerHTML = 'Reset';
  }
}

function renderTimer() {
  const displayTime = document.querySelector('.js-display-time');

  if (String(mil).length<2) {
    mil = `0${mil}`;
  }
  if (String(sec).length<2) {
    sec = `0${sec}`;
  }
  if (String(min).length<2) {
    min = `0${min}`;
  }
  
  displayTime.innerHTML = `${min} : ${sec} : ${mil}`;
}

function record() {
  const list = document.querySelector('.js-timeline-list');
  const newChild = document.createElement('li');
  newChild.textContent = document.querySelector('.js-display-time').innerHTML;
  list.appendChild(newChild);
}

function resetTimer() {
  mil = 0;
  sec = 0;
  min = 0;
  renderTimer();
  stopCount();
  document.querySelector('.js-timeline-list').innerHTML = '';
  document.querySelector('.js-start-button').innerHTML = 'Start';
  document.querySelector('.js-reset-button').style.display = 'none';
}

function handleResetRecord() {
  if (runTimer) {
    record();
  } else {
    resetTimer();
  }
}

document.querySelector('.js-start-button').addEventListener('click', ()=>handleStartStop());
document.querySelector('.js-reset-button').addEventListener('click', ()=>handleResetRecord());