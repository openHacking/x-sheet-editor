import { EventBind } from '../../utils/EventBind';
import { Constant } from '../../const/Constant';

/* global document */

class XTableKeyboard {

  constructor(table) {
    this.table = table;
    this.bind();
  }

  bind() {
    const { table } = this;
    const { focus } = table;
    EventBind.bind(document, Constant.SYSTEM_EVENT_TYPE.KEY_DOWN, (e) => {
      const { activate } = focus;
      const { keyCode } = e;
      if (activate) {
        const { attr } = activate;
        const { key, code, callback } = attr;
        if (key) {
          if (e[key] && keyCode === code) {
            callback(e);
          }
        } else if (keyCode === code) {
          callback(e);
        }
      }
      if (keyCode === 9) {
        e.preventDefault();
      }
    });
  }

  register({}) {

  }

}

export { XTableKeyboard };
