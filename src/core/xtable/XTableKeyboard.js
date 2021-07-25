/* global document */
import { XEvent } from '../../libs/XEvent';
import { Constant } from '../../const/Constant';

class XTableKeyboard {

  constructor(table) {
    const { focus } = table;
    this.table = table;
    this.items = [];
    this.handle = (event) => {
      const { activate } = focus;
      const { keyCode } = event;
      if (activate) {
        const { target } = activate;
        const find = this.find(target);
        if (find) {
          const { response } = find;
          response.forEach((item) => {
            if (item.keyCode(keyCode, event)) {
              item.handle(event);
            }
          });
        }
      }
      if (event.keyCode === 9) {
        // tab键 阻止浏览器默认行为
        event.preventDefault();
      }
    };
    this.bind();
  }

  bind() {
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.KEY_DOWN, this.handle);
  }

  unbind() {
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.KEY_DOWN, this.handle);
  }

  find(el) {
    const { items } = this;
    for (let i = 0, len = items.length; i < len; i += 1) {
      const item = items[i];
      const { target } = item;
      if (target === el) {
        return item;
      }
    }
    return null;
  }

  register({
    target = null, response = [],
  }) {
    this.items.push({
      target, response,
    });
  }

  destroy() {
    this.unbind();
  }

}

export {
  XTableKeyboard,
};
