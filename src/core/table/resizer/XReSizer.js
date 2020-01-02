/* global document */

import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';
import { h } from '../../../lib/Element';
import { EventBind } from '../../../utils/EventBind';
import { Constant } from '../../../utils/Constant';

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

  bind() {
    const { table } = this;
    const { settings, content } = table;
    const { cols, fixed } = table;
    const { scroll } = content;
    const { index } = settings;
    let moveOff = false;
    EventBind.bind(this, Constant.EVENT_TYPE.MOUSE_DOWN, (e) => {
      moveOff = true;
      const { x: tdx } = table.computeEventXy(e);
      const { x: xrx } = table.computeWidgetXy(this);
      const diff = tdx - xrx;
      EventBind.mouseMoveUp(document, (e) => {
        const { x: mx } = table.computeEventXy(e);
        this.css('left', `${mx - diff}px`);
        this.lineEl.css('height', `${table.visualHeight()}px`);
        this.lineEl.show();
      }, (e) => {
        moveOff = false;
        this.lineEl.hide();
        const { y } = table.computeEventXy(e);
        if (y <= 0) {
          this.hide();
        }
      });
      e.stopPropagation();
    });
    EventBind.bind(table, Constant.EVENT_TYPE.MOUSE_MOVE, (e) => {
      if (moveOff) return;
      const { x, y } = table.computeEventXy(e);
      const { ri, ci } = table.getRiCiByXy(x, y);
      if (ri === -1) {
        this.show();
        let left = index.width + cols.sectionSumWidth(0, ci);
        if (ci > fixed.fxLeft) {
          left -= scroll.x;
        }
        this.css('left', `${left - this.width}px`);
        this.hoverEl.css('width', `${this.width}px`);
        this.hoverEl.css('height', `${index.height}px`);
      } else {
        this.hide();
      }
    });
    EventBind.bind(table, Constant.EVENT_TYPE.MOUSE_LEAVE, () => {
      if (moveOff) return;
      this.hide();
    });
  }
}

export { XReSizer };
