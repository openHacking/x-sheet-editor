/* global document */

import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';
import { h } from '../../../lib/Element';
import { EventBind } from '../../../utils/EventBind';
import { Constant } from '../../../utils/Constant';
import { Utils } from '../../../utils/Utils';

class XReSizer extends Widget {
  constructor(table, options = { width: 5, minWidth: 90 }) {
    super(`${cssPrefix}-re-sizer-horizontal`);
    this.table = table;
    this.options = options;
    this.width = options.width;
    this.minWidth = options.minWidth;
    this.hoverEl = h('div', `${cssPrefix}-re-sizer-hover`);
    this.lineEl = h('div', `${cssPrefix}-re-sizer-line`);
    this.children(...[
      this.hoverEl,
      this.lineEl,
    ]);
    this.bind();
  }

  getEventLeft(event) {
    const { table } = this;
    const {
      settings, content, cols, fixed,
    } = table;
    const { scroll } = content;
    const { index } = settings;
    const { x, y } = table.computeEventXy(event);
    const { ri, ci } = table.getRiCiByXy(x, y);
    if (ri !== -1) {
      return {
        left: -1,
        x,
        y,
        ri,
        ci,
      };
    }
    let left = index.width + cols.sectionSumWidth(0, ci);
    if (ci > fixed.fxLeft) {
      left -= scroll.x;
    }
    return {
      left,
      x,
      y,
      ri,
      ci,
    };
  }

  bind() {
    const { table } = this;
    const { settings, cols } = table;
    const { index } = settings;
    let moveOff = false;
    EventBind.bind(this, Constant.EVENT_TYPE.MOUSE_DOWN, (e) => {
      Utils.serMousePointColReSize();
      moveOff = true;
      const { left, ci } = this.getEventLeft(e);
      const min = left - cols.getWidth(ci) + 90;
      let { x: mx } = table.computeEventXy(e);
      // console.log('left >>>', left + index.width);
      // console.log('min >>>', min);
      EventBind.mouseMoveUp(document, (e) => {
        ({ x: mx } = table.computeEventXy(e));
        // console.log('mx >>>', mx);
        if (mx < min) mx = min;
        this.css('left', `${mx}px`);
        this.lineEl.css('height', `${table.visualHeight()}px`);
        this.lineEl.show();
      }, (e) => {
        moveOff = false;
        this.lineEl.hide();
        this.css('left', `${mx}px`);
        const { y } = table.computeEventXy(e);
        if (y <= 0) {
          this.hide();
        }
        const newLeft = mx - (left - cols.getWidth(ci)) + this.width;
        table.setWidth(ci, newLeft);
        Utils.setMousePoint();
      });
      e.stopPropagation();
    });
    EventBind.bind(table, Constant.EVENT_TYPE.MOUSE_MOVE, (e) => {
      if (moveOff) return;
      // eslint-disable-next-line prefer-const
      let { left, ci } = this.getEventLeft(e);
      const min = left - cols.getWidth(ci) + 90;
      const visualWidth = table.visualWidth();
      // console.log('left >>>', left);
      // console.log('visualWidth', visualWidth);
      if (left > visualWidth) {
        left = visualWidth;
      }
      if (left === -1 || min > visualWidth) {
        this.hide();
      } else {
        this.show();
        this.css('left', `${left - this.width}px`);
        this.hoverEl.css('width', `${this.width}px`);
        this.hoverEl.css('height', `${index.height}px`);
      }
    });
    EventBind.bind(table, Constant.EVENT_TYPE.MOUSE_LEAVE, () => {
      if (moveOff) return;
      this.hide();
    });
  }
}

export { XReSizer };
