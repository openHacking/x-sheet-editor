import { Constant } from '../const/Constant';
import { Element } from './Element';

class BindPool {

  constructor() {
    this.pool = [];
  }

  unbind(ele, type, callback, option) {
    if (ele instanceof Element) {
      ele = ele.el;
    }
    const result = this.remove(ele, type, callback, option);
    if (result.length) {
      result.forEach((item) => {
        ele.removeEventListener(item.type, item.callback, item.option);
      });
    } else {
      ele.removeEventListener(type, callback, option);
    }
  }

  bind(ele, type, callback, option) {
    if (ele instanceof Element) {
      ele = ele.el;
    }
    this.pool.push({
      ele, type, callback, option,
    });
    ele.addEventListener(type, callback, option);
  }

  remove(ele, type = '*', callback = null, option = null) {
    const pool = [];
    const rem = [];
    this.pool.forEach((item) => {
      const eqElem = ele === item.ele;
      const eqOpt = option === null || option === item.option;
      const eqType = type === '*' || type === item.type;
      const eqCall = callback === null || callback === item.callback;
      if (eqElem && eqType && eqCall && eqOpt) {
        rem.push(item);
      } else {
        pool.push(item);
      }
    });
    this.pool = pool;
    return rem;
  }

  multipleUnbind(eles, type, callback, option) {
    eles.forEach((item) => {
      this.unbind(item, type, callback, option);
    });
  }

  multipleBind(eles, type, callback, option) {
    eles.forEach((item) => {
      this.bind(item, type, callback, option);
    });
  }

}
const pool = new BindPool();

class XEvent {

  static unbind(target, name, fn, option = false) {
    if (Array.isArray(target)) {
      pool.multipleUnbind(target, name, fn, option);
    } else {
      pool.unbind(target, name, fn, option);
    }
  }

  static bind(target, name, fn, option = false) {
    if (Array.isArray(target)) {
      pool.multipleBind(target, name, fn, option);
    } else {
      pool.bind(target, name, fn, option);
    }
  }

  static dbClick(target, func = () => {}) {
    let t = 0;
    XEvent.bind(target, Constant.SYSTEM_EVENT_TYPE.CLICK, (e) => {
      const n = Date.now();
      if (n - t <= 300) {
        func(e);
        t = 0;
      } else {
        t = n;
      }
    });
  }

  static mouseMoveUp(target, moveFunc = () => {}, upFunc = () => {}) {
    const xEvtMove = (evt) => {
      moveFunc(evt);
      evt.stopPropagation();
    };
    const xEvtUp = (evt) => {
      XEvent.unbind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, xEvtMove, true);
      XEvent.unbind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_UP, xEvtUp, true);
      upFunc(evt);
      evt.stopPropagation();
    };
    XEvent.bind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, xEvtMove, true);
    XEvent.bind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_UP, xEvtUp, true);
  }

}
window.XEventPool = pool;

export {
  XEvent
};
