/* global document */
import { Constant, cssPrefix } from '../../../const/Constant';
import { Widget } from '../../../lib/Widget';
import { h } from '../../../lib/Element';
import { EventBind } from '../../../utils/EventBind';
import { XTableMousePointer } from '../XTableMousePointer';

class ColFixed extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-col-fixed-bar`);
    const { xFixedView } = table;
    const fixedView = xFixedView.getFixedView();
    this.table = table;
    this.width = 6;
    this.fxSci = fixedView.sci;
    this.fxEci = fixedView.eci;
    this.block = h('div', `${cssPrefix}-table-col-fixed-block`);
    this.children(this.block);
  }

  bind() {
    const { table } = this;
    const {
      mousePointer, dropColFixed, xFixedView,
    } = table;
    let moveOff = true;
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.setSize();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.setSize();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      this.setActive(true);
      mousePointer.lock(ColFixed);
      mousePointer.set(XTableMousePointer.KEYS.grab, ColFixed);
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      if (!moveOff) {
        return;
      }
      this.setActive(false);
      mousePointer.free(ColFixed);
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      dropColFixed.show();
      this.setActive(true);
      const fixedView = xFixedView.getFixedView();
      this.fxSci = fixedView.sci;
      this.fxEci = fixedView.eci;
      mousePointer.lock(ColFixed);
      mousePointer.set(XTableMousePointer.KEYS.grab, ColFixed);
      const { x } = table.computeEventXy(e, table);
      dropColFixed.offset({ left: x });
      moveOff = false;
      if (xFixedView.hasFixedLeft()) {
        table.scrollX(0);
      }
      EventBind.mouseMoveUp(document, (e) => {
        const { x, y } = table.computeEventXy(e, table);
        const { ci } = table.getRiCiByXy(x, y);
        dropColFixed.offset({ left: x });
        this.fxEci = ci;
        this.setSize();
      }, () => {
        this.setActive(false);
        mousePointer.free(ColFixed);
        dropColFixed.hide();
        fixedView.eci = this.fxEci;
        xFixedView.setFixedView(fixedView);
        table.trigger(Constant.TABLE_EVENT_TYPE.FIXED_CHANGE);
        moveOff = true;
      });
    });
  }

  onAttach() {
    const { table } = this;
    // 初始化固定条大小
    this.setSize();
    // 绑定处理函数
    this.bind();
    // 注册焦点元素
    table.focus.register({ target: this });
  }

  setSize() {
    const {
      table, block, width,
    } = this;
    const { fxSci, fxEci } = this;
    const { cols } = table;
    const height = fxEci > -1 ? table.visualHeight() : table.getIndexHeight();
    const offset = fxEci > -1 ? width / 2 : width;
    const left = cols.sectionSumWidth(fxSci, fxEci) + table.getIndexWidth() - offset;
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
