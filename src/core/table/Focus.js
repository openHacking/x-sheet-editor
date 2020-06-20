import { Constant } from '../constant/Constant';
import { EventBind } from '../../utils/EventBind';

class Focus {

  constructor(table) {
    this.table = table;
    this.pool = [];
    this.activate = null;
  }

  findByEl(el) {
    for (let i = 0; i < this.pool.length; i += 1) {
      const item = this.pool[i];
      if (item.el === el) return item;
    }
    return null;
  }

  register({ el, attr = {}, stop = true }) {
    const find = this.findByEl(el);
    if (find) {
      Object.assign(find.attr, attr);
    } else {
      const item = { el, attr };
      this.pool.push(item);
      EventBind.bind(el, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
        this.activate = item;
        if (stop) e.stopPropagation();
      });
    }
  }

}

export { Focus };
