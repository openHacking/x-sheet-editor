/* global document */
import { Widget } from '../../../lib/Widget';
import { Constant, cssPrefix } from '../../../const/Constant';
import { h } from '../../../lib/Element';
import { EventBind } from '../../../utils/EventBind';
import { XTableMousePointer } from '../XTableMousePointer';

class RowFixed extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-row-fixed-bar`);
    const { xFixedView } = table;
    const fixedView = xFixedView.getFixedView();
    this.table = table;
    this.height = 6;
    this.fxSri = fixedView.sri;
    this.fxEri = fixedView.eri;
    this.block = h('div', `${cssPrefix}-table-row-fixed-block`);
    this.children(this.block);
  }

  bind() {
    const { table } = this;
    const {
      mousePointer, dropRowFixed, xFixedView,
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
      mousePointer.lock(RowFixed);
      mousePointer.set(XTableMousePointer.KEYS.grab, RowFixed);
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      if (!moveOff) {
        return;
      }
      this.setActive(false);
      mousePointer.free(RowFixed);
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      dropRowFixed.show();
      this.setActive(true);
      const fixedView = xFixedView.getFixedView();
      this.fxSri = fixedView.sri;
      this.fxEri = fixedView.eri;
      mousePointer.lock(RowFixed);
      mousePointer.set(XTableMousePointer.KEYS.grab, RowFixed);
      const { y } = table.computeEventXy(e, table);
      dropRowFixed.offset({ top: y });
      moveOff = false;
      if (xFixedView.hasFixedTop()) {
        table.scrollY(0);
      }
      EventBind.mouseMoveUp(document, (e) => {
        const { x, y } = table.computeEventXy(e, table);
        const { ri } = table.getRiCiByXy(x, y);
        dropRowFixed.offset({ top: y });
        this.fxEri = ri;
        this.setSize();
      }, () => {
        this.setActive(false);
        mousePointer.free(RowFixed);
        dropRowFixed.hide();
        fixedView.eri = this.fxEri;
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
    const { table, block, height } = this;
    const { fxSri, fxEri } = this;
    const { rows } = table;
    const width = fxEri > -1 ? table.visualWidth() : table.getIndexWidth();
    const offset = fxEri > -1 ? height / 2 : height;
    const top = rows.sectionSumHeight(fxSri, fxEri) + table.getIndexHeight() - offset;
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
