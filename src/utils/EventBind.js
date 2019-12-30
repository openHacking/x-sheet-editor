import { Constant } from './Constant';

class EventBind {
  static bind(target, name, fn) {
    (target.el || target).addEventListener(name, fn);
  }

  static unbind(target, name, fn) {
    (target.el || target).removeEventListener(name, fn);
  }

  static mouseMoveUp(target, moveFunc = () => {}, upFunc = () => {}) {
    target.xEvtUp = (evt) => {
      EventBind.unbind(target, Constant.EVENT_TYPE.MOUSE_MOVE, moveFunc);
      EventBind.unbind(target, Constant.EVENT_TYPE.MOUSE_UP, target.xEvtUp);
      upFunc(evt);
    };
    EventBind.bind(target, Constant.EVENT_TYPE.MOUSE_MOVE, moveFunc);
    EventBind.bind(target, Constant.EVENT_TYPE.MOUSE_UP, target.xEvtUp);
  }
}

export { EventBind };
