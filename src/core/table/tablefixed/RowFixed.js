/* global document */
import { Widget } from '../../../lib/Widget';
import { Constant, cssPrefix } from '../../../const/Constant';
import { h } from '../../../lib/Element';
import { EventBind } from '../../../utils/EventBind';

class RowFixed extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-row-fixed-bar`);
    this.table = table;
    this.block = h('div', `${cssPrefix}-table-row-fixed-block`);
    this.children(this.block);
  }

  bind() {
    const { table } = this;
    const {
      mousePointer, dropRowFixed,
    } = table;
    let moveOff = true;
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.setSize();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.setSize();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      this.setActive(true);
      mousePointer.set('-webkit-grab');
      e.stopPropagation();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      if (moveOff === false) {
        return;
      }
      this.setActive(false);
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      dropRowFixed.show();
      this.setActive(true);
      mousePointer.set('-webkit-grab');
      moveOff = false;
      const { y } = table.computeEventXy(e, table);
      dropRowFixed.offset({ top: y });
      EventBind.mouseMoveUp(document, (e) => {
        const { x, y } = table.computeEventXy(e, table);
        const { ri, ci } = table.getRiCiByXy(x, y);
        dropRowFixed.offset({ top: y });
        e.stopPropagation()
      }, () => {
        this.setActive(false);
        dropRowFixed.hide();
        moveOff = true;
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
    const { fxTop } = fixed;
    const { rows } = table;
    const height = 6;
    const width = fxTop > -1 ? table.visualWidth() : table.getIndexWidth();
    const offset = fxTop > -1 ? height / 2 : height;
    const top = rows.sectionSumHeight(0, fxTop) + table.getIndexHeight() - offset;
    block.offset({
      width: table.getIndexWidth(), height,
    });
    this.offset({
      height, width, left: 0, top,
    });
  }

  setActive(status) {
    if (status) {
      this.addClass('active');
      this.block.addClass('active');
    } else {
      this.removeClass('active');
      this.block.removeClass('active');
    }
  }

}

export {
  RowFixed,
};
