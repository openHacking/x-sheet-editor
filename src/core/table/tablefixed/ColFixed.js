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
      mousePointer, dropColFixed, xFixedView, cols,
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
      // 获取固定区域
      const fixedView = xFixedView.getFixedView();
      this.fxSci = fixedView.sci;
      this.fxEci = fixedView.eci;
      // 锁定鼠标指针
      mousePointer.lock(ColFixed);
      mousePointer.set(XTableMousePointer.KEYS.grab, ColFixed);
      // 推拽条移动位置
      const { x } = table.computeEventXy(e, table);
      dropColFixed.offset({ left: x });
      moveOff = false;
      // 如果存在固定位置
      // 定位到起始处
      if (xFixedView.hasFixedLeft()) {
        table.scroll.x = 0;
        table.scroll.ci = this.fxEci + 1;
        table.resize();
      }
      EventBind.mouseMoveUp(document, (e) => {
        // 推拽条移动位置
        const { x, y } = table.computeEventXy(e, table);
        dropColFixed.offset({ left: x });
        // 更新行号
        const { ci } = table.getRiCiByXy(x, y);
        this.fxEci = ci;
        this.setSize();
      }, () => {
        this.setActive(false);
        // 释放指针
        mousePointer.free(ColFixed);
        dropColFixed.hide();
        // 更新固定区域
        fixedView.eci = this.fxEci;
        xFixedView.setFixedView(fixedView);
        // 更新滚动距离
        if (xFixedView.hasFixedLeft()) {
          table.scroll.x = 0;
          table.scroll.ci = this.fxEci + 1;
          table.resize();
        } else {
          table.scroll.x = cols.sectionSumWidth(0, this.fxSci - 1);
          table.scroll.ci = this.fxSci;
          table.resize();
        }
        // 发送通知
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

  setActive(status) {
    if (status) {
      this.block.addClass('active');
      this.addClass('active');
    } else {
      this.block.removeClass('active');
      this.removeClass('active');
    }
  }

  setSize() {
    const {
      table, block,
    } = this;
    const { fxSci, fxEci } = this;
    const { cols } = table;
    const width = ColFixed.WIDTH;
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

}

ColFixed.WIDTH = 6;

export {
  ColFixed,
};
