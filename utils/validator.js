import { addUniqueIdToPair, clearInputs } from '../pages/index.js';

// const WORD_ONE = document.querySelector('.input_word-one input');
// const WORD_TWO = document.querySelector('.input_word-two input');
const RADIO_LIST = document.querySelectorAll('.input-radio input');
const RADIO_LIST_ERR_MSG = document.querySelector('.radiolist__err-message');

/** Проверяем все ли слова введены */
function checkRadioFormInputValue(pair) {
  console.log('wefwf', pair);
  console.log('12324234', pair.wordOne);
  
  if (!pair.wordOne == '' && !pair.wordTwo == '') {
    return {
      'isFill': 'isFill',
      'newPair': pair
    };
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
function validateRadioForm(newpair) {
  let radio = checkRadioFormLevel();
  let controlObj = checkRadioFormInputValue(newpair);

  if (controlObj == 'null' || radio == 'null') {
    return;
  } else if (controlObj.isFill == 'isFill' && radio[1] == 'checked') {
    addUniqueIdToPair(radio[2].value, controlObj.newPair);
    radio[2].checked = false;
    clearInputs();
  } else {
    return;
  }
  RADIO_LIST_ERR_MSG.innerHTML = '';
}

export { RADIO_LIST_ERR_MSG, validateRadioForm };