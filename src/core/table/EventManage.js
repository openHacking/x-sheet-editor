import { Constant } from '../../utils/Constant';
import { Event } from './Event';

const TABLE_EVENT = {
  MOUSE_DOWN: 1,
  MOUSE_UP: 2,
  MOUSE_MOVE: 3,
  SCROLL_X: 4,
  SCROLL_Y: 5,
};

class EventManage {
  constructor(el) {
    this._ = [];
    this.el = el;
    this.bind();
  }

  bind() {
    this.el.on(Constant.EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.triggerEvent(TABLE_EVENT.MOUSE_DOWN, new Event(e));
    });
    this.el.on(Constant.EVENT_TYPE.MOUSE_UP, (e) => {
      this.triggerEvent(TABLE_EVENT.MOUSE_UP, new Event(e));
    });
    this.el.on(Constant.EVENT_TYPE.MOUSE_MOVE, (e) => {
      this.triggerEvent(TABLE_EVENT.MOUSE_MOVE, new Event(e));
    });
  }

  addEvent(type, cb) {
    this._.push({
      type, cb,
    });
  }

  triggerEvent(type, event) {
    this._.forEach((item) => {
      if (type === item.type) {
        if (event.isUse) return false;
        item.cb(event);
      }
      return true;
    });
  }
}

export { EventManage, TABLE_EVENT };
