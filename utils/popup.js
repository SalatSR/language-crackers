import { RADIO_LIST_ERR_MSG } from './validator.js';

const POPUP = document.querySelector('.popup');
const BTN_CLOSE = document.getElementById('btn-close');

function viewScore(title, subtitle) {
  const POPUP_SCORE = document.getElementById('popup-plate-score');
  POPUP_SCORE.style.display = 'block';
  const POPUP_TITLE = POPUP.querySelector('.popup__title');
  const POPUP_SUBTITLE = POPUP.querySelector('.popup__subtitle');
  POPUP_TITLE.innerHTML = title;
  POPUP_SUBTITLE.innerHTML = subtitle;
  return POPUP_SCORE;
}

/** Открываем POPUP */
function openPopup(data) {
  POPUP.style.visibility = 'visible';
  POPUP.style.opacity = '1';
  BTN_CLOSE.addEventListener('click', function handler() {
    this.removeEventListener('click', handler);
    closePopup(data);
  })
}

/** Закрываем POPUP, скрываем динамическое содержимое */
function closePopup(data) {
  data.style.display = 'none';
  POPUP.style.visibility = 'hidden';
  RADIO_LIST_ERR_MSG.innerHTML = '';
  POPUP.style.opacity = '0';
}

export { viewScore, openPopup, closePopup };