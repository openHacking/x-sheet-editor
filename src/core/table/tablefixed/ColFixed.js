/* global document */
import { Constant, cssPrefix } from '../../../const/Constant';
import { Widget } from '../../../lib/Widget';
import { XDraw } from '../../../canvas/XDraw';
import { h } from '../../../lib/Element';
import { EventBind } from '../../../utils/EventBind';

class ColFixed extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-col-fixed-bar`);
    this.table = table;
    this.block = h('div', `${cssPrefix}-table-col-fixed-block`);
    this.children(this.block);
  }

  bind() {
    const { table } = this;
    const {
      mousePointer,
    } = table;
    const { key, type } = Constant.MOUSE_POINTER_TYPE.FIXED_GRAB;
    let moveOff = true;
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.setSize();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.setSize();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      this.setActive(true);
      mousePointer.on(key);
      mousePointer.set(type, key);
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      if (moveOff === false) {
        return;
      }
      this.setActive(false);
      mousePointer.off(key);
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      moveOff = false;
      this.setActive(true);
      EventBind.mouseMoveUp(document, (e) => {
        const { x, y } = table.computeEventXy(e, table);
        const { ri, ci } = table.getRiCiByXy(x, y);
      }, () => {
        moveOff = true;
        this.setActive(false);
      });
      e.stopPropagation();
    });
  }

  onAttach() {
    this.setSize();
    this.bind();
  }

  setSize() {
    const { table, block } = this;
    const { fixed } = table;
    const { fxLeft } = fixed;
    const { cols } = table;
    const width = XDraw.dpr() * 2.5;
    const height = fxLeft > -1 ? table.visualHeight() : table.getIndexHeight();
    const offset = fxLeft > -1 ? width / 2 : width;
    const left = cols.sectionSumWidth(0, fxLeft) + table.getIndexWidth() - offset;
    block.offset({
      height: table.getIndexHeight(), width,
    });
    this.offset({
      width, height, left, top: 0,
    });
  }

  setActive(status) {
    if (status) {
      this.block.addClass('active');
      this.addClass('active');
    } else {
      this.block.removeClass('active');
      this.removeClass('active');
    }
  }

}

export {
  ColFixed,
};