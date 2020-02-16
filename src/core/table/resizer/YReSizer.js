/* global document */

import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';
import { h } from '../../../lib/Element';
import { EventBind } from '../../../utils/EventBind';
import { Constant } from '../../../utils/Constant';
import { Utils } from '../../../utils/Utils';

class YReSizer extends Widget {
  constructor(table, options = { height: 5 }) {
    super(`${cssPrefix}-re-sizer-vertical`);
    this.table = table;
    this.options = options;
    this.height = options.height;
    this.hoverEl = h('div', `${cssPrefix}-re-sizer-hover`);
    this.lineEl = h('div', `${cssPrefix}-re-sizer-line`);
    this.children(...[
      this.hoverEl,
      this.lineEl,
    ]);
    this.bind();
  }

  getEventTop(event) {
    const { table } = this;
    const {
      settings, rows, fixed, scroll,
    } = table;
    const { index } = settings;
    const { x, y } = table.computeEventXy(event);
    const { ri, ci } = table.getRiCiByXy(x, y);
    if (ci !== -1) {
      return {
        top: -1,
        x,
        y,
        ri,
        ci,
      };
    }
    let top = index.height + rows.sectionSumHeight(0, ri);
    if (ri > fixed.fxTop) {
      top -= scroll.y;
    }
    return {
      top,
      x,
      y,
      ri,
      ci,
    };
  }

  bind() {
    const { table } = this;
    const { settings, rows, mousePointType } = table;
    const { index } = settings;
    let moveOff = false;
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      mousePointType.set('row-resize', 'YReSizer');
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      moveOff = true;
      mousePointType.on(['YReSizer']);
      mousePointType.set('row-resize', 'YReSizer');
      const { top, ri } = this.getEventTop(e);
      const min = top - rows.getHeight(ri) + rows.minHeight;
      let { y: my } = table.computeEventXy(e);
      EventBind.mouseMoveUp(document, (e) => {
        ({ y: my } = table.computeEventXy(e));
        // console.log('my >>>', my);
        my -= this.height / 2;
        my = Utils.minIf(my, min);
        this.css('top', `${my}px`);
        this.lineEl.css('width', `${table.visualWidth()}px`);
        this.lineEl.show();
        e.stopPropagation();
        e.preventDefault();
      }, (e) => {
        moveOff = false;
        mousePointType.off();
        this.lineEl.hide();
        this.css('top', `${my}px`);
        const { x } = table.computeEventXy(e);
        if (x <= 0) {
          this.hide();
        }
        const newLeft = my - (top - rows.getHeight(ri)) + this.height;
        table.setHeight(ri, newLeft);
      });
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      if (moveOff) return;
      // eslint-disable-next-line prefer-const
      let { top, ri } = this.getEventTop(e);
      const min = top - rows.getHeight(ri) + rows.minHeight;
      const visualHeight = table.visualHeight();
      // console.log('top >>>', top);
      // console.log('visualHeight >>>', visualHeight);
      // console.log('min >>>', min);
      if (top > visualHeight) {
        top = visualHeight;
      }
      if (top === -1 || min > visualHeight || ri === -1) {
        this.hide();
      } else {
        this.show();
        this.css('top', `${top - this.height}px`);
        this.hoverEl.css('width', `${index.width}px`);
        this.hoverEl.css('height', `${this.height}px`);
      }
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      if (moveOff) return;
      this.hide();
    });
  }
}

export { YReSizer };
