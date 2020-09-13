/* global document */
import { Constant, cssPrefix } from '../../../const/Constant';
import { Widget } from '../../../lib/Widget';
import { h } from '../../../lib/Element';
import { EventBind } from '../../../utils/EventBind';
import { XTableMousePointer } from '../XTableMousePointer';

class RowFixed extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-row-fixed-bar`);
    const { xFixedView } = table;
    const fixedView = xFixedView.getFixedView();
    const block = h('div', `${cssPrefix}-table-row-fixed-block`);
    this.table = table;
    this.fxSri = fixedView.sri;
    this.fxEri = fixedView.eri;
    this.block = block;
    this.children(this.block);
  }

  bind() {
    const { table } = this;
    const {
      mousePointer, dropRowFixed, xFixedView, rows,
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
      // 获取固定区域
      const fixedView = xFixedView.getFixedView();
      this.fxSri = fixedView.sri;
      this.fxEri = fixedView.eri;
      // 锁定鼠标指针
      mousePointer.lock(RowFixed);
      mousePointer.set(XTableMousePointer.KEYS.grab, RowFixed);
      // 推拽条移动位置
      const { y } = table.computeEventXy(e, table);
      dropRowFixed.offset({ top: y });
      moveOff = false;
      // 如果存在固定位置
      // 定位到起始处
      if (xFixedView.hasFixedTop()) {
        table.scroll.y = 0;
        table.scroll.ri = this.fxEri + 1;
        table.resize();
      }
      EventBind.mouseMoveUp(document, (e) => {
        // 推拽条移动位置 + 行号
        const { x, y } = table.computeEventXy(e, table);
        dropRowFixed.offset({ top: y });
        // 更新行号
        const { ri } = table.getRiCiByXy(x, y);
        this.fxEri = ri;
        this.setSize();
      }, () => {
        this.setActive(false);
        // 释放指针
        mousePointer.free(RowFixed);
        dropRowFixed.hide();
        // 更新固定区域
        fixedView.eri = this.fxEri;
        xFixedView.setFixedView(fixedView);
        // 更新滚动距离
        if (xFixedView.hasFixedTop()) {
          table.scroll.y = 0;
          table.scroll.ri = this.fxEri + 1;
          table.resize();
        } else {
          table.scroll.y = rows.sectionSumHeight(0, this.fxSri - 1);
          table.scroll.ri = this.fxSri;
          table.resize();
        }
        // 发送通知
        table.trigger(Constant.TABLE_EVENT_TYPE.FIXED_CHANGE);
        moveOff = true;
      });
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

  onAttach() {
    const { table } = this;
    // 初始化固定条大小
    this.setSize();
    // 绑定处理函数
    this.bind();
    // 注册焦点元素
    table.focus.register({ target: this, stop: false });
  }

  setSize() {
    const { table, block } = this;
    const { fxSri, fxEri } = this;
    const { rows } = table;
    const height = RowFixed.HEIGHT;
    const width = fxEri > -1 ? table.visualWidth() : table.getIndexWidth();
    const outer = fxEri > -1 ? height / 2 : height;
    const top = rows.sectionSumHeight(fxSri, fxEri) + table.getIndexHeight() - outer;
    block.offset({
      width: table.getIndexWidth(), height,
    });
    this.offset({
      height, width, left: 0, top,
    });
  }

}
RowFixed.HEIGHT = 6;

export {
  RowFixed,
};
