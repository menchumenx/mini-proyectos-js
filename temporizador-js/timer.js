


export let minutes = 0;
export let seconds = 0;

export const updateTime = (tiempoRestante) => {
  minutes = Math.floor(tiempoRestante / 60);
  seconds = tiempoRestante % 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return { minutes, seconds };
};

const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');

export let tiempoRestante = 300; // 300==5min - Inicializa tiempoRestante con el valor deseado, por ejemplo 5 minutos (300 segundos)
export let intervalo;

export const update_countdown = () => {
  updateTime(tiempoRestante);

  if (minutesElement) minutesElement.textContent = minutes;
  if (secondsElement) secondsElement.textContent = seconds;

  tiempoRestante--;

  if (tiempoRestante === 0) {
    clearInterval(intervalo);
    // reinicia la cuenta atras automáticamente 
    // restartCountdown();
    // avisa de que la cuenta atras a finalizado 
    endCountdown() 
  }
};

//! activa la cuenta atras 
export const interval = () => {
  intervalo = setInterval(update_countdown, 1000);
}

const restartCountdown = () =>{
  tiempoRestante = 300;
  intervalo = setInterval(update_countdown, 1000);
}


const add_5_button = document.getElementById('add5');
const less_5_button = document.getElementById('less5');

const add_five_sec = () => {
  tiempoRestante += 6;
  updateTime(tiempoRestante)
}
const less_five_sec = () => {
  tiempoRestante -= 4;
  updateTime(tiempoRestante)
}

update_countdown()
if (add_5_button) {
  add_5_button.addEventListener('click', add_five_sec);
  add_5_button.classList.add('addButon');
}
if (less_5_button) {
  less_5_button.addEventListener('click', less_five_sec);
  less_5_button.classList.add('addButon');
}


const counterContainer = document.getElementById('infocontainer')

// Crear elemento para cuando finaliza el tiempo
const endCountdown = () => {
  const endCountdownElement = document.createElement('h2');
  if (endCountdownElement) {
    endCountdownElement.classList.add('redColor');
    endCountdownElement.textContent = 'The countdownd is end! Do you want to restart?';
  }
  const restartCountdownButton = document.createElement('button');
  if (restartCountdownButton) {
    restartCountdownButton.classList.add('restartButon');
    restartCountdownButton.textContent = 'Restart'
    restartCountdownButton.addEventListener('click', () =>{
      restartCountdown();
      removeEndCountdown();
    } )
  }

  if(counterContainer){
    counterContainer.classList.add('infoContainer')
    counterContainer.appendChild(endCountdownElement);
    counterContainer.appendChild(restartCountdownButton);
  }
}

const removeEndCountdown = () => {
  const endCountdownElement = document.querySelector('.redColor');
  const restartCountdownButton = document.querySelector('.restartButon');

  if (endCountdownElement) {
    counterContainer.removeChild(endCountdownElement);
  }
  if (restartCountdownButton) {
    counterContainer.removeChild(restartCountdownButton);
  }
}

