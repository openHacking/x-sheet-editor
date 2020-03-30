import { EventBind } from '../../utils/EventBind';
import { Constant } from '../../utils/Constant';

/* global document */

class KeyboardManage {

  constructor() {
    this.pool = [];
    this.active = null;
    this.bind();
  }

  register({ el, key = null, code = null, callback }) {
    this.pool.push({ el, key, code, callback });
    const len = this.pool.length - 1;
    EventBind.bind(el, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.active = this.pool[len];
    });
  }

  bind() {
    EventBind.bind(document, Constant.SYSTEM_EVENT_TYPE.KEY_DOWN, (e) => {
      const { active } = this;
      const { keyCode } = e;
      if (active) {
        const { key, code, callback } = active;
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
}

export { KeyboardManage };
