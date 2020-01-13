import { Constant } from './Constant';

class EventBind {
  static bind(target, name, fn) {
    if (Array.isArray(target)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of target) {
        (item.el || item).addEventListener(name, fn);
      }
    } else {
      (target.el || target).addEventListener(name, fn);
    }
  }

  static unbind(target, name, fn) {
    if (Array.isArray(target)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of target) {
        (item.el || item).addEventListener(name, fn);
      }
    } else {
      (target.el || target).removeEventListener(name, fn);
    }
  }

  static mouseMoveUp(target, moveFunc = () => {}, upFunc = () => {}) {
    const xEvtUp = (evt) => {
      EventBind.unbind(target, Constant.EVENT_TYPE.MOUSE_MOVE, moveFunc);
      EventBind.unbind(target, Constant.EVENT_TYPE.MOUSE_UP, xEvtUp);
      upFunc(evt);
    };
    EventBind.bind(target, Constant.EVENT_TYPE.MOUSE_MOVE, moveFunc);
    EventBind.bind(target, Constant.EVENT_TYPE.MOUSE_UP, xEvtUp);
  }

  static dbClick(target, func = () => {}) {
    let t = 0;
    EventBind.bind(target, Constant.EVENT_TYPE.CLICK, (e) => {
      const n = Date.now();
      if (n - t <= 300) {
        func(e);
        t = 0;
      } else {
        t = n;
      }
    });
  }
}

export { EventBind };
