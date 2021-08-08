/* global document */
import { Constant } from '../../const/Constant';
import { XEvent } from '../../lib/XEvent';
import { Element } from '../../lib/Element';
import { SheetUtils } from '../../utils/SheetUtils';

let instance = SheetUtils.Nul;
let root = SheetUtils.Nul;

class XTableWidgetFocus {

  static getInstance() {
    if (instance) {
      return instance;
    }
    instance = new XTableWidgetFocus();
    return instance;
  }

  static setRoot(element) {
    root = element;
  }

  constructor() {
    this.activate = {};
    this.items = [];
    this.native = {};
    this.handle = (event) => {
      if (this.native.target === event.target) {
        return;
      }
      const exist = this.include(Element.wrap(event.target));
      this.native = event;
      this.activate = exist || {};
    };
    this.bind();
  }

  bind() {
    const { handle } = this;
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, handle, true);
  }

  unbind() {
    const { handle } = this;
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, handle, true);
  }

  include(el) {
    while (!el.equals(root)) {
      const find = this.exist(el);
      if (find) {
        return find;
      }
      el = el.parent();
    }
    return null;
  }

  exist(el) {
    for (let i = 0, len = this.items.length; i < len; i += 1) {
      const item = this.items[i];
      const { target } = item;
      if (target.equals(el)) {
        return item;
      }
    }
    return null;
  }

  remove(el) {
    this.items = this.items.filter((item) => {
      const { target, callback } = item;
      const equals = target.equals(el);
      if (equals) {
        XEvent.unbind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, callback);
      }
      return equals;
    });
  }

  register({ target }) {
    this.items.push({ target });
  }

  destroy() {
    this.unbind();
    this.items = [];
  }

}

export {
  XTableWidgetFocus,
};
