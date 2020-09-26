import { Constant } from '../const/Constant';
import { Element } from '../lib/Element';

class BindPool {

  constructor() {
    this.pool = [];
  }

  unbind(ele, type, callback, option) {
    if (ele instanceof Element) {
      ele = ele.el;
    }
    const result = this.remove(ele, type);
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

  remove(ele, type = '*') {
    const pool = [];
    const rem = [];
    this.pool.forEach((item) => {
      if (ele === item.ele) {
        if (type === '*' || type === item.type) {
          rem.push(item);
        }
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

class EventBind {

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
    EventBind.bind(target, Constant.SYSTEM_EVENT_TYPE.CLICK, (e) => {
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
      EventBind.unbind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, xEvtMove, true);
      EventBind.unbind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_UP, xEvtUp, true);
      upFunc(evt);
      evt.stopPropagation();
    };
    EventBind.bind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, xEvtMove, true);
    EventBind.bind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_UP, xEvtUp, true);
  }

}

export { EventBind };
