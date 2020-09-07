import { Constant } from '../const/Constant';

class EventBind {

  static unbind(target, name, fn, option) {
    if (Array.isArray(target)) {
      target.forEach((item) => {
        (item.el || item).removeEventListener(name, fn, option);
      });
    } else {
      (target.el || target).removeEventListener(name, fn, option);
    }
  }

  static bind(target, name, fn, option) {
    if (Array.isArray(target)) {
      target.forEach((item) => {
        (item.el || item).addEventListener(name, fn, option);
      });
    } else {
      (target.el || target).addEventListener(name, fn, option);
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
