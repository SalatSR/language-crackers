import './index.css?<?echo time();?>';
import { TIMER_SETTER, gameInterval, setTimeToTimerPanel, setTimer, setUserTime } from '../utils/setTtimer.js';
import { validateRadioForm } from '../utils/validator.js';
import { showMessage, openPopup } from '../utils/popup.js';
import { defaultWords } from '../utils/defaultVariables.js';

/** START Service Worker */
// window.addEventListener('load', async () => {
//   if (navigator.serviceWorker) {
//     try {
//       await navigator.serviceWorker.register('/sw.js');
//       console.log('Service worker register success');
//     } catch (e) {
//       console.log('Service worker register fail');
//     }

//   }

//   await loadPosts();
// })


/** END Service Worker */

let elementaryWords = [];
let intermediateWords = [];
let advancedWords = [];

let variableObject = {
  'defaultWords': defaultWords,
  'elementaryWords': elementaryWords,
  'intermediateWords': intermediateWords,
  'advancedWords': advancedWords
};

/** INTRO */
const INTRO = document.querySelector('.intro');
const ABOUT = document.querySelector('.about');
const BTN_PLAY = document.getElementById('btn-to-play');
const BTN_ABOUT = document.getElementById('btn-to-about');

/** MAIN */
const MAIN_SCREEN = document.querySelector('.main');
const BTN_MENU = document.getElementById('btn-menu');
const BTN_START = document.getElementById('btn-start');
const CARDS_CONTAINER = document.querySelector('.cards');
const CARDS = document.querySelectorAll('.card');
let totalFoundedPairsCount = 0;
let summArray = [];
let workArray = [];
let pairTimeouts = [];
let firstCardClick;
let firstCard;
let interval;

/** ПАНЕЛЬ МЕНЮ */
const MENU = document.querySelector('.menu');
const BTN_MENU_ADD_NEW_WORDS = document.getElementById('btn-add-new-words');
const BTN_MENU_GAME_SETTING = document.getElementById('btn-game-settings');
const CHECK_LIST = document.querySelectorAll('.input-check input');

/** Общее */

const WORD_ONE = document.querySelector('.input_word-one input');
const WORD_TWO = document.querySelector('.input_word-two input');

/** Записываем новые пары в localStorage */
function setLocalStorage() {
  localStorage.setItem('user', JSON.stringify(variableObject));
}

/** Проверяем наличие данных в localStorage, если есть вписываем в переменные, если нет */
function getLocalStorage() {
  if (localStorage.getItem('user') == null) {
    setLocalStorage();
    return;
  } else {
    elementaryWords = JSON.parse(localStorage.getItem('user', variableObject.elementaryWords));
    intermediateWords = JSON.parse(localStorage.getItem('user', variableObject.intermediateWords));
    advancedWords = JSON.parse(localStorage.getItem('user', variableObject.advancedWords));
  }
}

/** Добавляем новые пары */
function addNewPair(array, newObj) {
  variableObject[array].push(newObj);
  setLocalStorage();
}

/** Переключаем состояние кнопок - активно/неактивно */
function toggleBtnState(btn, state) {
  if (state == 1) {
    btn.disabled = true;
    btn.classList.add('btn_disabled')
  } else if (state == 2) {
    btn.disabled = false;
    btn.classList.remove('btn_disabled')
  }
}

/** Переключаем состояние карточек - активно/неактивно */
function toggleFormState(array, state) {
  if (state == 1) {
    array.forEach(element => {
      element.disabled = true;
    });
  } else if (state == 2) {
    array.forEach(element => {
      element.disabled = false;
    });
  }
}

function hideScreen(screen) {
  screen.style.display = 'none';
}

function renderScreen(screen, style) {
  screen.style.display = style;
}

/** INTRO */

BTN_PLAY.addEventListener('click', () => {
  getLocalStorage();
  hideScreen(INTRO);
  renderScreen(MAIN_SCREEN, 'flex');
  toggleCardState(CARDS_CONTAINER, 'none');
  setUserTime();
  setTimeToTimerPanel(TIMER_SETTER.value);
  setBtnBack(MAIN_SCREEN, 'main', INTRO);
})

BTN_ABOUT.addEventListener('click', () => {
  hideScreen(INTRO);
  renderScreen(ABOUT, 'flex');
  setBtnBack(ABOUT, 'about', INTRO);
})

/** INTRO КОНЕЦ */

/** ПАНЕЛЬ МЕНЮ */

/** Создаём общий массив */
function setSummArray(count, array) {
  if (count == 1) {
    summArray = variableObject[array];
  } else if (count == 2) {
    summArray = variableObject[array[0]].concat(variableObject[array[1]]);
  } else if (count == 3) {
    summArray = variableObject[array[0]].concat(variableObject[array[1]].concat(variableObject[array[2]]));
  }
  setWorkArray();
  toggleFormState(CHECK_LIST, 1);
}

/** Получаем массивы выбранных уравней */
function checkSourceArray(params) {
  let count = 0;
  let array = [];
  for (let i = 0; i < CHECK_LIST.length; i++) {
    if (CHECK_LIST[i].checked == true) {
      array[count] = CHECK_LIST[i].id;
      count++;
    }
  }
  setSummArray(count, array);
}

/** Генерируем уникальное значение для каждой пары слов */
function encryptString(str) {
  return str.split('').map(value => value.charCodeAt(0) ^ 1).join('');
}

/** Связываем униакльное значение с его парой */
function addUniqueIdToPair(level, newObj) {
  let uniqueId = encryptString(newObj.wordOne);
  newObj.uniqueId = uniqueId;
  addNewPair(level, newObj);
}

/** Кнопка открытия меню */
BTN_MENU.addEventListener('click', () => {
  hideScreen(MAIN_SCREEN);
  renderScreen(MENU, 'flex');
  setBtnBack(MENU, 'menu', MAIN_SCREEN);
})

/** Получаем значение инпутов для проверки */
function getWords() {
  let newPair = {
    'uniqueId': null,
    'wordOne': WORD_ONE.value,
    'wordTwo': WORD_TWO.value
  };
  validateRadioForm(newPair);
}

/** Стираем значения инпутов */
function clearInputs(params) {
  WORD_ONE.value = '';
  WORD_TWO.value = '';
}

/** POPUP добавление новых слов */
function setPopupContentPlateNewWords() {
  const MENU_PLATE_ADD_NEW_WORDS = document.getElementById('popup-plate-add-new-words');
  MENU_PLATE_ADD_NEW_WORDS.style.display = 'block';

  const BTN_ADD = document.querySelector('.btn_submit-radio');
  BTN_ADD.addEventListener('click', (event) => {
    event.preventDefault();
    getWords();
  })
  return MENU_PLATE_ADD_NEW_WORDS;
}

BTN_MENU_ADD_NEW_WORDS.addEventListener('click', () => {
  openPopup(setPopupContentPlateNewWords());
})

/** POPUP настройки игры */
function setPopupContentPlateGameSettings() {
  const MENU_PLATE_GAME_SETTINGS = document.getElementById('popup-plate-game-settings');
  MENU_PLATE_GAME_SETTINGS.style.display = 'block';
  return MENU_PLATE_GAME_SETTINGS;
}

BTN_MENU_GAME_SETTING.addEventListener('click', () => {
  openPopup(setPopupContentPlateGameSettings());
})

/** КОНЕЦ МЕНЮ */

/** Меняем кнопку "Меню" на "Сброс" после запуска игры */
function toggleBtnMenuToReset(hidenBtn, renderBtn) {
  const BTN_HIDEN = document.querySelector(`.${hidenBtn}`);
  BTN_HIDEN.style.display = 'none';
  const BTN_RENDER = document.querySelector(`.${renderBtn}`);
  BTN_RENDER.style.display = 'inline-block';
  BTN_RENDER.addEventListener('click', function handler() {
    this.removeEventListener('click', handler);
    resetGame();
  })
}

/** РАБОТА КАРТОЧЕК */

/** Генерируем случайные значения */
function _setRandom(params) {
  return Math.floor(Math.random() * params);
}

/** Расставляем слова в случайном порядке */
function _getRandomSlot(items) {
  return items[_setRandom(items.length)];
}

/** Получаем массив пустых слотов */
function getEmptySlot(col) {
  let emptySlots = document.querySelectorAll('.card_' + col + '[data-state=empty]');
  return _getRandomSlot(emptySlots);
}

/** Вписываем слова
 *  Присваиваем уникальный ключ для пар
 *  и аттрибут неугаданной карточки */
function setPairs(arr) {
  for (var i = 0; arr.length > i; i++) {
    setPair(arr[i]);
  }
}

/** Получаем пары слов */
function getPair() {
  return summArray[_setRandom(summArray.length)];
}

function setPair(obj) {
  let leftSlot = getEmptySlot('left');
  let rightSlot = getEmptySlot('right');

  if (!leftSlot || !rightSlot) return;
  if (obj === undefined) {
    openPopup(showMessage('', 'Недостаточно слов в словаре'));
    resetGame();
  } else {
    leftSlot.style.opacity = 1;
    leftSlot.textContent = obj.wordOne;
    leftSlot.setAttribute('data-pair', obj.uniqueId);
    leftSlot.setAttribute('data-state', 'fill');
    rightSlot.style.opacity = 1;
    rightSlot.textContent = obj.wordTwo;
    rightSlot.setAttribute('data-pair', obj.uniqueId);
    rightSlot.setAttribute('data-state', 'fill');
  }
}

/** Записываем новые пары слов взамен найденных */
function setWorkArray() {
  const ARR_LENGTH = 5;
  for (let i = 0; i < ARR_LENGTH; i++) {
    let count = _setRandom(summArray.length);
    workArray.push(summArray[count]);
  }
}

/** Удаляем из рабочего массива использованные пары слов */
function findIndexOfPair(dataPair) {
  let deletedIndex = workArray.indexOf(workArray.find(object => object.uniqueId === dataPair));
  workArray.splice(deletedIndex, 1);
}

/** Отсчитываем количество угаданных пар и записываем новые */
function countEmptySlot() {
  let emptySlots = document.querySelectorAll('.card_' + 'right' + '[data-state=empty]');

  if (emptySlots.length >= 1) {
    for (var i = 0; emptySlots.length > i; i++) {
      pairTimeouts[i] = setTimeout(function () {
        setPair(getPair())
      }, 1000 * i * 1.2);
    }
  }
}

function addPiecesForCracker(cards) {
  cards.forEach(card => {
    for (let i = 0; i < 7; i++) {
      let piece = document.createElement('div');
      piece.classList.add('piece');
      piece.classList.add('piece' + (i + 1));
      card.appendChild(piece);
    }
  })
}

/** Обнуляем совпавшие пары */
function deletePairs(card) {
  /** переназначаем значение переменной карточки первого касания
   * другой переменной, чтобы избежать перезаписи значения "первого клика"
   */
  let oldFirstCard = firstCard;

  oldFirstCard.classList.add('cracked');
  card.classList.add('cracked');
  oldFirstCard.textContent = '';
  card.textContent = '';

  /** Подключаем анимацию перелома крекера, ставим задержку для выполнения анимации */
  addPiecesForCracker(CARDS);
  setTimeout(() => {
    oldFirstCard.style.opacity = 0;
    card.style.opacity = 0;

    oldFirstCard.setAttribute('data-state', 'empty');
    card.setAttribute('data-state', 'empty');
    oldFirstCard.classList.remove('cracked');
    card.classList.remove('cracked');

  }, 400)
}

/** Обнуляем выбор первой карточки */
function restartFirstCardClick() {
  firstCardClick = undefined;
  if (firstCard == undefined) {
    return;
  }
  firstCard.classList.remove('card_active');
}

/** Проверяем карточки на совпадение пары */
function checkPairs(card, pairNumber) {
  if ((firstCardClick == pairNumber) && (firstCard.textContent !== card.textContent)) {
    findIndexOfPair(firstCard.getAttribute('data-pair'));
    deletePairs(card);
    restartFirstCardClick();
    totalFoundedPairsCount++;
  } else {
    /** если выбрана та же самая карта */
    if (firstCard.getAttribute('data-pair') === card.getAttribute('data-pair')) {
      restartFirstCardClick();
    } else {
      firstCard.classList.add('incorrect');
      card.classList.add('incorrect');
      setTimeout(() => {
        firstCard.classList.remove('incorrect');
        card.classList.remove('incorrect');
      }, 200)
      restartFirstCardClick();
    }
  }
}

/** Разрешаем/запрещаем события на карточках */
function toggleCardState(element, state) {
  element.style.pointerEvents = state;
}

/** Сбрасываем карточки */
function resetGame() {
  clearInterval(interval);
  clearInterval(gameInterval);
  const settedCards = document.querySelectorAll('.card');

  pairTimeouts.forEach(pairTimeout => {
    clearTimeout(pairTimeout);
  });

  settedCards.forEach(card => {
    card.style.opacity = 1;
    card.textContent = '';
    card.removeAttribute('data-pair');
    card.setAttribute('data-state', 'empty');
    card.classList.remove('cracked');
  });

  CARDS_CONTAINER.style.opacity = '0';
  BTN_START.style.display = 'block';
  restartFirstCardClick();
  totalFoundedPairsCount = 0;
  workArray = [];
  toggleCardState(CARDS_CONTAINER, "none");
  toggleFormState(CHECK_LIST, 2);
  toggleBtnState(BTN_START, 2);
  setTimeToTimerPanel(TIMER_SETTER.value);
  toggleBtnMenuToReset('btn_reset', 'btn_menu');
}

/** Проверяем первое касание или не первое
 *  Если первое получаем карточку, её парный аттрибут
 *  и окрашиваем как выбранную
 *  Если не первое получаем карточку, её парный аттрибут
 *  и отправляем на проверку совпадения
 *  Проверяем количество отгаданных карточек
 */
CARDS.forEach(card => {
  card.addEventListener('click', function (event) {
    event.preventDefault();
    if (firstCardClick == undefined) {
      firstCardClick = event.target.getAttribute('data-pair');
      event.target.classList.add('card_active');
      firstCard = event.target;
    } else {
      let pairNumber = event.target.getAttribute('data-pair');
      checkPairs(event.target, pairNumber);
    }
  })
});

/** Ставим слушатель события и его самоудаление на кнопку "Назад" */
function setBtnBack(thisScreen, id, prevScreen) {
  if (thisScreen === MAIN_SCREEN) {
    resetGame();
  }
  const BTN_BACK = document.getElementById(`btn-back-${id}`);
  BTN_BACK.addEventListener('click', function handler() {
    hideScreen(thisScreen);
    renderScreen(prevScreen, 'flex');
    if (prevScreen === INTRO) {
      resetGame();
    }
    this.removeEventListener('click', handler);
  })
};

function endGame(params) {
  openPopup(showMessage('Ваш счёт:', totalFoundedPairsCount));
  resetGame();
  clearInterval(interval);
}

BTN_START.addEventListener('click', () => {
  BTN_START.style.display = 'none';
  CARDS_CONTAINER.style.opacity = '1';
  toggleCardState(CARDS_CONTAINER, "auto");
  checkSourceArray();
  setPairs(workArray);
  setTimer(TIMER_SETTER.value);
  interval = setInterval(() => {
    countEmptySlot();
  }, 900)
  toggleBtnState(BTN_START, 1);
  toggleBtnMenuToReset('btn_menu', 'btn_reset');
})

export { endGame, addUniqueIdToPair, clearInputs };