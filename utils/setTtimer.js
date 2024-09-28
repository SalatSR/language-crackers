import { endGame } from "../pages/index.js";

const TIMER_SETTER = document.getElementById('hendletimer');
const TIMER_PANEL = document.getElementById('timer');
const TIMER_PANEL_SPAN = TIMER_PANEL.querySelector('span');
const TIMER_LABEL = document.querySelector('.menu__input-label');
let gameInterval;

/** Отображаем текущее выбранное время в поле лейбл инпута */
function setUserTime() {
  let [minutes, seconds] = convertDurationToTime(TIMER_SETTER.value);
  TIMER_LABEL.innerHTML = `Таймер: ${minutes + ":" + seconds}`;
}

/** Установка таймера */
TIMER_SETTER.addEventListener('input', (event) => {
  event.preventDefault();
  setUserTime();
  setTimeToTimerPanel(TIMER_SETTER.value);
})

/** Конвертируем время */
function convertDurationToTime(params) {
  let minutes = parseInt(params / 60, 10);
  let seconds = parseInt(params % 60, 10);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return [minutes, seconds];
}

/** Отображаем отсчет таймера на панели меню */
function setTimeToTimerPanel(value) {
  let [minutes, seconds] = convertDurationToTime(value);
  TIMER_PANEL_SPAN.textContent = minutes + ":" + seconds;
}

/** Ставим таймер */
function setTimer(duration) {
  let timer = duration;
  gameInterval = setInterval(function minusSecond(duration) {

    setTimeToTimerPanel(timer);

    if (timer === 0 || timer === undefined) {
      setTimeout(() => {
        endGame();
      }, 10);
      clearInterval(gameInterval);
      return;
    } else if (--timer < 0) {
      timer = duration;
    }
    return minusSecond.bind();
  }(), 1000);
}

export { TIMER_SETTER, gameInterval, convertDurationToTime, setTimeToTimerPanel, setTimer, setUserTime };