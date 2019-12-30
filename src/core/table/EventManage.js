class EventManage {
  constructor() {
    this._ = [];
  }

  addEvent(type, cb) {
    this._.push({
      type, cb,
    });
  }

  triggerEvent(type, event) {
    this._.forEach((item) => {
      if (type === item.type) {
        item.cb(event);
      }
    });
  }
}

const TABLE_EVENT = {
  MOUSE_DOWN: 1,
  MOUSE_UP: 2,
  MOUSE_MOVE: 3,
  SCROLL_X: 4,
  SCROLL_Y: 5,
};

export { EventManage, TABLE_EVENT };
