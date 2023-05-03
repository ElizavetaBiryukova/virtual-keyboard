import { keys, keyboardKeysArr } from './keys.js';

class Keyboard {
  constructor() {
    this.lang = localStorage.getItem('lang') === 'ru' ? 'ru' : 'en';
    this.upperCase = false;
  }

  init() {
    this.wrapper = document.createElement('main');
    this.title = document.createElement('h1');
    this.textarea = document.createElement('textarea');
    this.container = document.createElement('div');
    this.description = document.createElement('p');
    this.language = document.createElement('p');

    this.wrapper.classList.add('wrapper');

    this.title.classList.add('title');
    this.title.textContent = 'Virtual keyboard';

    this.textarea.classList.add('textarea');

    this.container.classList.add('keyboard');

    this.description.classList.add('description');
    this.description.textContent = 'This keyboard was developed and tested in Microsoft Windows.';

    this.language.classList.add('language');
    this.language.textContent = 'To switch ENG/РУС input methods, press Ctrl+Alt.';

    this.wrapper.append(this.title, this.textarea, this.container, this.description, this.language);

    document.body.append(this.wrapper);

    this.createKey();
    this.changeLang(this.lang);
    this.createActions();
    this.textarea.focus();
  }

  createActions() {
    document.addEventListener('keydown', (e) => {
      const key = document.getElementById(e.code);

      this.textarea.focus();

      this.switchLanguage(e);

      if (e.code === 'Tab') {
        this.createTab(e);
        key.classList.add('active');
      } else if (e.code === 'Enter') {
        this.createEnter(e);
        key.classList.add('active');
      } else if (e.code === 'Backspace') {
        this.createBackspace(e);
        key.classList.add('active');
      } else if (e.code === 'Delete') {
        this.createDelete(e);
        key.classList.add('active');
      } else if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
        e.preventDefault();
        key.classList.add('active');
      } else if (e.code === 'AltLeft' || e.code === 'AltRight') {
        e.preventDefault();
        this.container.focus();
        key.classList.add('active');
      } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        e.preventDefault();
        this.createShift(e.shiftKey);
        this.createUpperCase();
        key.classList.add('active');
      } else if (e.code === 'ArrowUp') {
        this.createArrowUp();
        key.classList.add('active');
      } else if (e.code === 'ArrowDown') {
        this.createArrowDown();
        key.classList.add('active');
      } else if (e.code === 'ArrowRight') {
        this.createArrowRight();
        key.classList.add('active');
      } else if (e.code === 'ArrowLeft') {
        this.createArrowLeft();
        key.classList.add('active');
      } else if (e.code === 'CapsLock') {
        this.createUpperCase();
        this.wrapper.classList.toggle('capsLock');
        key.classList.toggle('active');
      } else if (!key) {
        e.preventDefault();
      } else {
        if (this.upperCase) {
          this.insertText(key.textContent.toUpperCase());
        } else {
          this.insertText(key.textContent);
        }
        key.classList.add('active');
      }
    });

    document.addEventListener('keyup', (e) => {
      const key = document.getElementById(e.code);
      const capsLock = document.getElementById('CapsLock');
      if (!key) {
        e.preventDefault();
        return;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.upperCase = false;
        this.createShift(e.shiftKey);
      }

      key.classList.remove('active');

      if (e.code === 'CapsLock' && this.upperCase) {
        key.classList.add('active');
        this.wrapper.classList.add('capsLock');
      }

      if (e.code === 'ShiftLeft' && capsLock.classList.contains('active')) {
        this.upperCase = true;
      }

      if (e.code === 'ShiftRight' && capsLock.classList.contains('active')) {
        this.upperCase = true;
      }
    });

    this.container.addEventListener('click', (e) => {
      const capsLock = document.getElementById('CapsLock');
      if (e.shiftKey) {
        this.upperCase = true;
      }
      if (e.shiftKey && capsLock.classList.contains('active')) {
        this.upperCase = false;
      }
      this.textarea.focus();
      const keyDown = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        code: e.target.id,
      });
      document.dispatchEvent(keyDown);

      this.textarea.focus();
      const keyUp = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        code: e.target.id,
      });
      document.dispatchEvent(keyUp);
    });
  }

  insertText(text) {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    this.textarea.value = this.textarea.value.substring(0, start) + text
      + this.textarea.value.substring(end);
    this.textarea.selectionEnd = start + text.length;
    this.removeFocus();
  }

  changeLang(lang) {
    Array.from(this.container.querySelectorAll('.key')).forEach((e) => {
      e.textContent = keyboardKeysArr[e.id][lang];
    });
  }

  removeFocus() {
    this.textarea.blur();
  }

  createKey() {
    keys.forEach((row) => {
      const keyboardRow = document.createElement('div');
      keyboardRow.classList.add('row');

      row.forEach((key) => {
        keyboardKeysArr[key.code] = key.lang;
        const keyElement = document.createElement('button');
        keyElement.setAttribute('id', key.code);
        keyElement.classList.add('key');
        keyElement.classList.add(`${key.code}`);

        keyElement.textContent = key.lang.en;

        keyboardRow.append(keyElement);
      });

      this.container.append(keyboardRow);
    });
  }

  switchLanguage(e) {
    if ((e.ctrlKey || e.metaKey) && e.altKey && !e.repeat) {
      e.preventDefault();
      this.lang = this.lang === 'ru' ? 'en' : 'ru';
      localStorage.setItem('lang', this.lang);
      this.changeLang(this.lang);
    }
  }

  createTab(e) {
    e.preventDefault();
    this.insertText('\t');
  }

  createEnter(e) {
    e.preventDefault();
    this.insertText('\n');
  }

  createBackspace(e) {
    e.preventDefault();
    let result;
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    if (start === end) {
      result = this.textarea.value.substring(0, start - 1) + this.textarea.value.substring(end);
    } else {
      result = this.textarea.value.substring(0, start) + this.textarea.value.substring(end);
    }
    this.textarea.value = result;
    this.textarea.selectionEnd = (start === end) ? start - 1 : start;
  }

  createDelete(e) {
    e.preventDefault();
    let result;
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    if (start === end) {
      result = this.textarea.value.substring(0, start) + this.textarea.value.substring(end + 1);
    } else {
      result = this.textarea.value.substring(0, start) + this.textarea.value.substring(end);
    }
    this.textarea.value = result;
    this.textarea.selectionEnd = start;
  }

  createArrowUp() {
    this.textarea.selectionStart = 0;
    this.textarea.selectionEnd = this.textarea.selectionStart;
  }

  createArrowDown() {
    this.textarea.selectionEnd = this.textarea.textLength;
    this.textarea.selectionStart = this.textarea.selectionEnd;
  }

  createArrowRight() {
    this.textarea.selectionStart = Math.min(
      this.textarea.textLength,
      this.textarea.selectionEnd + 1,
    );
    this.textarea.selectionEnd = this.textarea.selectionStart - 1;
  }

  createArrowLeft() {
    this.textarea.selectionStart = Math.max(0, this.textarea.selectionStart - 1);
    this.textarea.selectionEnd = this.textarea.selectionStart + 1;
  }

  createUpperCase() {
    if (!this.upperCase) {
      this.upperCase = true;
    } else {
      this.upperCase = false;
    }
  }

  createShift(shiftKey) {
    Array.from(this.container.querySelectorAll('.key')).forEach((e) => {
      if (e.id === 'Backquote' && this.lang === 'en') {
        e.textContent = shiftKey ? '~' : '`';
      } else if (e.id === 'Minus') {
        e.textContent = shiftKey ? '_' : '-';
      } else if (e.id === 'Equal') {
        e.textContent = shiftKey ? '+' : '=';
      } else if (e.id === 'BracketLeft' && this.lang === 'en') {
        e.textContent = shiftKey ? '{' : '[';
      } else if (e.id === 'BracketRight' && this.lang === 'en') {
        e.textContent = shiftKey ? '}' : ']';
      } else if (e.id === 'Backslash') {
        e.textContent = shiftKey ? '|' : '\\';
      } else if (e.id === 'Semicolon' && this.lang === 'en') {
        e.textContent = shiftKey ? ':' : ';';
      } else if (e.id === 'Quote' && this.lang === 'en') {
        e.textContent = shiftKey ? '"' : "'";
      } else if (e.id === 'Comma' && this.lang === 'en') {
        e.textContent = shiftKey ? '<' : ',';
      } else if (e.id === 'Period' && this.lang === 'en') {
        e.textContent = shiftKey ? '>' : '.';
      } else if (e.id === 'Slash' && this.lang === 'en') {
        e.textContent = shiftKey ? '?' : '/';
      } else if (e.id === 'Slash' && this.lang === 'ru') {
        e.textContent = shiftKey ? ',' : '.';
      } else if (e.id === 'Digit1') {
        e.textContent = shiftKey ? '!' : '1';
      } else if (e.id === 'Digit2') {
        e.textContent = shiftKey ? '@' : '2';
      } else if (e.id === 'Digit3') {
        e.textContent = shiftKey ? '#' : '3';
      } else if (e.id === 'Digit4') {
        e.textContent = shiftKey ? '$' : '4';
      } else if (e.id === 'Digit5') {
        e.textContent = shiftKey ? '%' : '5';
      } else if (e.id === 'Digit6') {
        e.textContent = shiftKey ? '^' : '6';
      } else if (e.id === 'Digit7') {
        e.textContent = shiftKey ? '&' : '7';
      } else if (e.id === 'Digit8') {
        e.textContent = shiftKey ? '*' : '8';
      } else if (e.id === 'Digit9') {
        e.textContent = shiftKey ? '(' : '9';
      } else if (e.id === 'Digit0') {
        e.textContent = shiftKey ? ')' : '0';
      }
    });
  }
}

const keyboard = new Keyboard();

keyboard.init();
