import { XScreenItem } from '../../xscreen/XScreenItem';
import { XScreenLTPart } from '../../xscreen/part/XScreenLTPart';
import { XScreenTPart } from '../../xscreen/part/XScreenTPart';
import { XScreenBRPart } from '../../xscreen/part/XScreenBRPart';
import { XScreenLPart } from '../../xscreen/part/XScreenLPart';
import { EventBind } from '../../../../utils/EventBind';
import { Constant } from '../../../../const/Constant';
import { RectRange } from '../../tablebase/RectRange';

class XSelectItem extends XScreenItem {

  constructor(table) {
    super({
      lt: new XScreenLTPart(),
      t: new XScreenTPart(),
      br: new XScreenBRPart(),
      l: new XScreenLPart(),
    });
    this.selectRange = null;
    this.table = table;
    this.bind();
  }

  bind() {
    const { table } = this;
    const { mousePointer, focus } = table;
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCALE_CHANGE, () => {});
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {});
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e1) => {
      if (e1.button !== 0) return;
      const { activate } = focus;
      const { el } = activate;
      if (el !== table) return;
      const { x, y } = table.computeEventXy(e1);
      const downRange = this.downRange(x, y);
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.CHANGE_HEIGHT, () => {});
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.CHANGE_WIDTH, () => {});
  }

  downRange(x, y) {
    const { table } = this;
    const { rows, cols } = table;
    const { ri, ci } = table.getRiCiByXy(x, y);
    if (ri === -1 && ci === -1) {
      return new RectRange(0, 0, rows.len - 1, cols.len - 1);
    }
    if (ri === -1) {
      return new RectRange(0, ci, rows.len - 1, ci);
    }
    if (ci === -1) {
      return new RectRange(ri, 0, ri, cols.len - 1);
    }
    const merges = table.getTableMerges();
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return merge;
    }
    return new RectRange(ri, ci, ri, ci);
  }

  moveRange(x, y) {

  }
}

export {
  XSelectItem,
};
