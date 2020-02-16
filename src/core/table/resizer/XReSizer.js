/* global document */

import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';
import { h } from '../../../lib/Element';
import { EventBind } from '../../../utils/EventBind';
import { Constant } from '../../../utils/Constant';
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
    this.bind();
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
    const { settings, cols, mousePointType } = table;
    const { index } = settings;
    let moveOff = false;
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      mousePointType.set('col-resize', 'XReSizer');
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      moveOff = true;
      mousePointType.on(['XReSizer']);
      mousePointType.set('col-resize', 'XReSizer');
      const { left, ci } = this.getEventLeft(e);
      const min = left - cols.getWidth(ci) + cols.minWidth;
      let { x: mx } = table.computeEventXy(e);
      // console.log('left >>>', left + index.width);
      // console.log('min >>>', min);
      EventBind.mouseMoveUp(document, (e) => {
        ({ x: mx } = table.computeEventXy(e));
        // console.log('mx >>>', mx);
        mx -= this.width / 2;
        mx = Utils.minIf(mx, min);
        this.css('left', `${mx}px`);
        this.lineEl.css('height', `${table.visualHeight()}px`);
        this.lineEl.show();
        e.stopPropagation();
        e.preventDefault();
      }, (e) => {
        moveOff = false;
        mousePointType.off();
        this.lineEl.hide();
        this.css('left', `${mx}px`);
        const { y } = table.computeEventXy(e);
        if (y <= 0) {
          this.hide();
        }
        const newLeft = mx - (left - cols.getWidth(ci)) + this.width;
        table.setWidth(ci, newLeft);
      });
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      if (moveOff) return;
      // eslint-disable-next-line prefer-const
      let { left, ci } = this.getEventLeft(e);
      const min = left - cols.getWidth(ci) + cols.minWidth;
      const visualWidth = table.visualWidth();
      // console.log('left >>>', left);
      // console.log('visualWidth', visualWidth);
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
