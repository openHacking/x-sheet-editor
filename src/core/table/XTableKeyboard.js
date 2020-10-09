/* global document */
import { Event } from '../../lib/Event';
import { Constant } from '../../const/Constant';

class XTableKeyboard {

  constructor(table) {
    this.table = table;
    this.pool = [];
    this.bind();
  }

  bind() {
    const { table } = this;
    const { focus } = table;
    Event.bind(document, Constant.SYSTEM_EVENT_TYPE.KEY_DOWN, (e) => {
      const { activate } = focus;
      const { keyCode } = e;
      if (activate) {
        const { target } = activate;
        const find = this.find(target);
        if (find && find.keyCode === keyCode) {
          find.callback();
        }
      }
      if (keyCode === 9) {
        e.preventDefault();
      }
    });
  }

  find(el) {
    const { pool } = this;
    for (let i = 0; i < pool.length; i += 1) {
      const item = pool[i];
      const { target } = item;
      if (target === el) {
        return item;
      }
    }
    return null;
  }

  register({
    target, keyCode, callback,
  }) {
    this.pool.push({ target, keyCode, callback });
  }

}

export {
  XTableKeyboard,
};
