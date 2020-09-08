import { Constant } from '../../const/Constant';
import { EventBind } from '../../utils/EventBind';

class XTableFocus {

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

  register({
    el, attr = {}, stop = false, focus = false,
  }) {
    const find = this.findByEl(el);
    if (find) {
      Object.assign(find.attr, attr);
    } else {
      const item = { el, attr };
      this.pool.push(item);
      if (focus) {
        this.activate = item;
      }
      EventBind.bind(el, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
        const target = el.el || el;
        if (e.currentTarget === target) {
          this.activate = item;
        }
        if (stop) {
          e.stopPropagation();
        }
      });
    }
  }

}

export { XTableFocus };
