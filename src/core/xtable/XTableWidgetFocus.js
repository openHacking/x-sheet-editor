/* global document */
import { Constant } from '../../const/Constant';
import { XEvent } from '../../lib/XEvent';
import { Element } from '../../lib/Element';
import { SheetUtils } from '../../utils/SheetUtils';

let instance = SheetUtils.Nul;
let root = SheetUtils.Nul;

/**
 * XTableWidgetFocus
 */
class XTableWidgetFocus {

  /**
   * 获取单实例
   * @return {null}
   */
  static getInstance() {
    if (instance) {
      return instance;
    }
    instance = new XTableWidgetFocus();
    return instance;
  }

  /**
   * 设置根节点
   * @param element
   */
  static setRoot(element) {
    root = element;
  }

  /**
   * XTableWidgetFocus
   */
  constructor() {
    this.activate = {};
    this.items = [];
    this.native = {};
    this.handle = (event) => {
      if (event.target === this.native.target) {
        return;
      }
      const find = this.include(Element.wrap(event.target));
      if (find) {
        const { target } = find;
        this.forward(target, event);
      } else {
        this.forward(null, null);
      }
    };
    this.bind();
  }

  /**
   * el 是否是注册的组件元素的子元素
   * @param el
   * @return {null|*}
   */
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

  /**
   * 绑定事件处理程序
   */
  bind() {
    const { handle } = this;
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, handle, true);
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.FOCUS, handle, true);
  }

  /**
   * 解绑事件处理程序
   */
  unbind() {
    const { handle } = this;
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, handle, true);
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.FOCUS, handle, true);
  }

  /**
   * 组件是否注册
   * @param el
   * @return {null|*}
   */
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

  /**
   * 删除当前组件
   * @param el
   */
  remove(el) {
    this.items = this.items.filter((item) => {
      const { target } = item;
      return !target.equals(el);
    });
  }

  /**
   * 设置焦点组件
   * @param target
   * @param event
   */
  forward(target, event) {
    if (target) {
      this.activate = { target };
    } else {
      this.activate = {};
    }
    if (event) {
      this.native = event;
    } else {
      this.native = event || {};
    }
  }

  /**
   * 注册组件元素
   * @param target
   */
  register({ target }) {
    this.items.push({ target });
  }

  /**
   * 销毁
   */
  destroy() {
    this.unbind();
    this.items = [];
  }

}

export {
  XTableWidgetFocus,
};
