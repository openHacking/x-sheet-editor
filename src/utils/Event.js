import { Constant } from './Constant';

class Event {
  static bind(target, name, fn) {
    (target.el || target).addEventListener(name, fn);
  }

  static unbind(target, name, fn) {
    (target.el || target).removeEventListener(name, fn);
  }

  static mouseMoveUp(target, moveFunc = () => {}, upFunc = () => {}) {
    target.xEvtUp = (evt) => {
      Event.unbind(target, Constant.EVENT_TYPE.MOUSE_MOVE, moveFunc);
      Event.unbind(target, Constant.EVENT_TYPE.MOUSE_UP, target.xEvtUp);
      upFunc(evt);
    };
    Event.bind(target, Constant.EVENT_TYPE.MOUSE_MOVE, moveFunc);
    Event.bind(target, Constant.EVENT_TYPE.MOUSE_UP, target.xEvtUp);
  }
}

export { Event };
