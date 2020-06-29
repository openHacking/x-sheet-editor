/* global document */
import { Widget } from '../../../lib/Widget';
import { cssPrefix, Constant } from '../../../constant/Constant';
import { h } from '../../../lib/Element';
import { EventBind } from '../../../utils/EventBind';
import { Utils } from '../../../utils/Utils';

class XReSizer extends Widget {

  constructor(table, options = { width: 5 }) {
    super(`${cssPrefix}-re-sizer-horizontal`);

    this.table = table;
    this.options = options;
    this.width = options.width;
    this.hoverEl = h('div', `${cssPrefix}-re-sizer-hover`);
    this.lineEl = h('div', `${cssPrefix}-re-sizer-line`);
    this.children(...[
      this.hoverEl,
      this.lineEl,
    ]);
  }

  onAttach() {
    this.bind();
    this.table.focus.register({ el: this });
  }

  getEventLeft(event) {
    const { table } = this;
    const {
      settings, cols, fixed, scroll,
    } = table;
    const { index } = settings;
    const { x, y } = table.computeEventXy(event);
    const { ri, ci } = table.getRiCiByXy(x, y);
    if (ri !== -1) {
      return { left: -1, x, y, ri, ci };
    }
    let left = index.width + cols.sectionSumWidth(0, ci);
    if (ci > fixed.fxLeft) {
      left -= scroll.x;
    }
    return {
      left, x, y, ri, ci,
    };
  }

  bind() {
    const { table } = this;
    const {
      settings, cols, mousePointer, tableDataSnapshot,
    } = table;
    const { colsDataProxy } = tableDataSnapshot;
    const { index } = settings;
    const { key, type } = Constant.MOUSE_POINTER_TYPE.COL_RESIZE;
    let moveOff = false;
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      if (moveOff) return;
      mousePointer.on(key);
      mousePointer.set(type, key);
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      if (moveOff) return;
      mousePointer.off(key);
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      moveOff = true;
      mousePointer.on(key);
      mousePointer.set(type, key);
      const { left, ci } = this.getEventLeft(e);
      const min = left - cols.getWidth(ci) + cols.minWidth;
      let { x: mx } = table.computeEventXy(e);
      EventBind.mouseMoveUp(document, (e) => {
        ({ x: mx } = table.computeEventXy(e));
        mx -= this.width / 2;
        mx = Math.ceil(Utils.minIf(mx, min));
        this.css('left', `${mx}px`);
        this.lineEl.css('height', `${table.visualHeight()}px`);
        this.lineEl.show();
      }, (e) => {
        moveOff = false;
        mousePointer.off(key);
        this.lineEl.hide();
        this.css('left', `${mx}px`);
        const { y } = table.computeEventXy(e);
        if (y <= 0) {
          this.hide();
        }
        const newLeft = mx - (left - cols.getWidth(ci)) + this.width;
        tableDataSnapshot.begin();
        colsDataProxy.setWidth(ci, newLeft);
        tableDataSnapshot.end();
        table.render();
      });
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      if (moveOff) return;
      // eslint-disable-next-line prefer-const
      let { left, ci } = this.getEventLeft(e);
      const min = left - cols.getWidth(ci) + cols.minWidth;
      const visualWidth = table.visualWidth();
      if (left > visualWidth) {
        left = visualWidth;
      }
      if (left === -1 || min > visualWidth || ci === -1) {
        this.hide();
      } else {
        this.show();
        this.css('left', `${left - this.width}px`);
        this.hoverEl.css('width', `${this.width}px`);
        this.hoverEl.css('height', `${index.height}px`);
      }
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      if (moveOff) return;
      this.hide();
    });
  }
}

export { XReSizer };
