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
      // 如果dom多可能存在性能问题
      if (event.target === this.native.target) {
        return;
      }
      const find = this.include(Element.wrap(event.target));
      this.native = event;
      this.activate = find || {};
    };
    this.bind();
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

  bind() {
    const { handle } = this;
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, handle, true);
  }

  unbind() {
    const { handle } = this;
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, handle, true);
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
      const { target } = item;
      return !target.equals(el);
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
