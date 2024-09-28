import { addUniqueIdToPair } from '../pages/index.js';

const WORD_ONE = document.querySelector('.input_word-one input');
const WORD_TWO = document.querySelector('.input_word-two input');
const RADIO_LIST = document.querySelectorAll('.input-radio input');
const RADIO_LIST_ERR_MSG = document.querySelector('.radiolist__err-message');

/** Стираем значения инпутов */
function clearInputs(params) {
  WORD_ONE.value = '';
  WORD_TWO.value = '';
}

/** Получаем значение инпутов для проверки */
function getWords() {
  let newPair = [WORD_ONE.value, WORD_TWO.value];
  return newPair;
}

/** Проверяем все ли слова введены */
function checkRadioFormInputValue(params) {
  let pair = getWords();
  if (!pair[0] == '' && !pair[1] == '') {
    return ['', 'isFill', pair];
  } else {
    RADIO_LIST_ERR_MSG.innerHTML = 'Слово не введено';
    return 'null';
  }
}

/** Находим выбранный уровень сложности */
function checkRadioFormLevel(params) {
  let count = 0;

  while (count < 3) {
    for (let i = 0; i < RADIO_LIST.length; i++) {
      if (RADIO_LIST[i].checked == false) {
        count++;
      } else {
        return ['', 'checked', RADIO_LIST[i]];
      }
    }
  }

  if (count == 3) {
    RADIO_LIST_ERR_MSG.innerHTML = 'Укажи уровень сложности';
    return 'null';
  }
}

/** Проверяем заполнение формы перед добавлением новых слов */
function validateRadioForm() {
  let radio = checkRadioFormLevel();
  let pair = checkRadioFormInputValue();

  if (pair == 'null' || radio == 'null') {
    return;
  } else if (pair[1] == 'isFill' && radio[1] == 'checked') {
    addUniqueIdToPair(radio[2].value, pair[2]);
    radio[2].checked = false;
    clearInputs();
  } else {
    return;
  }
  RADIO_LIST_ERR_MSG.innerHTML = '';
}

export { RADIO_LIST_ERR_MSG, validateRadioForm };