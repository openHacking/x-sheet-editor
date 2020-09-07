/* global document */
import { Widget } from '../../../lib/Widget';
import { cssPrefix, Constant } from '../../../const/Constant';
import { h } from '../../../lib/Element';
import { EventBind } from '../../../utils/EventBind';
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
  }

  onAttach() {
    this.bind();
    this.table.focus.register({ el: this });
  }

  getEventTop(event) {
    const { table } = this;
    const {
      rows, fixed, scroll,
    } = table;
    const { index } = table;
    const { x, y } = table.computeEventXy(event);
    const { ri, ci } = table.getRiCiByXy(x, y);
    if (ci !== -1) {
      return {
        top: -1, x, y, ri, ci,
      };
    }
    let top = index.getHeight() + rows.sectionSumHeight(0, ri);
    if (ri > fixed.fxTop) {
      top -= scroll.y;
    }
    return {
      top, x, y, ri, ci,
    };
  }

  bind() {
    const { table } = this;
    const {
      rows, mousePointer,
    } = table;
    const tableDataSnapshot = table.getTableDataSnapshot();
    const { rowsDataProxy } = tableDataSnapshot;
    const { index } = table;
    let moveOff = false;
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      mousePointer.set('row-resize');
      moveOff = true;
      const { top, ri } = this.getEventTop(e);
      const min = top - rows.getHeight(ri) + rows.min;
      let { y: my } = table.computeEventXy(e);
      EventBind.mouseMoveUp(document, (e) => {
        ({ y: my } = table.computeEventXy(e));
        my -= this.height / 2;
        my = Math.ceil(Utils.minIf(my, min));
        this.css('top', `${my}px`);
        this.lineEl.css('width', `${table.visualWidth()}px`);
        this.lineEl.show();
      }, (e) => {
        this.lineEl.hide();
        moveOff = false;
        this.css('top', `${my}px`);
        const { x } = table.computeEventXy(e);
        if (x <= 0) {
          this.hide();
        }
        const newTop = my - (top - rows.getHeight(ri)) + this.height;
        tableDataSnapshot.begin();
        rowsDataProxy.setHeight(ri, newTop);
        tableDataSnapshot.end();
        table.resize();
      });
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      mousePointer.set('row-resize');
      e.stopPropagation();
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      if (moveOff) return;
      this.hide();
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      // eslint-disable-next-line prefer-const
      let { top, ri } = this.getEventTop(e);
      const min = top - rows.getHeight(ri) + rows.min;
      const visualHeight = table.visualHeight();
      if (top > visualHeight) {
        top = visualHeight;
      }
      if (top === -1 || min > visualHeight || ri === -1) {
        this.hide();
      } else {
        this.show();
        this.css('top', `${top - this.height}px`);
        this.hoverEl.css('width', `${index.getWidth()}px`);
        this.hoverEl.css('height', `${this.height}px`);
      }
    });
  }
}

export { YReSizer };
