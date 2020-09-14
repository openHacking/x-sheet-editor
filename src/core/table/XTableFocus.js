import { Constant } from '../../const/Constant';
import { EventBind } from '../../utils/EventBind';

class XTableFocus {

  constructor(table) {
    this.table = table;
    this.activate = {};
    this.pool = [];
  }

  bind(item) {
    const { stop, target } = item;
    EventBind.bind(target, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const alike = this.findByChild(e.target);
      if (alike) {
        this.activate = alike;
        if (stop) {
          e.stopPropagation();
        }
      }
    });
  }

  register({
    target, attr = {}, stop = false, focus = false,
  }) {
    let item = this.findByNode(target);
    if (item) {
      Object.assign(item.attr, attr);
      item.focus = focus;
      item.stop = stop;
    } else {
      item = {
        target, attr, stop, focus,
      };
      this.pool.push(item);
    }
    if (focus) {
      this.activate = item;
    }
    this.bind(item);
  }

  findByNode(el) {
    for (let i = 0; i < this.pool.length; i += 1) {
      const item = this.pool[i];
      if (item.target.el === el) {
        return item;
      }
    }
    return null;
  }

  findByChild(el) {
    const { table } = this;
    const root = table.el.parentNode;
    while (el !== root) {
      const find = this.findByNode(el);
      if (find) {
        return find;
      }
      el = el.parentNode;
    }
    return null;
  }

}

export { XTableFocus };
