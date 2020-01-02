import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';
import { h } from '../../../lib/Element';

class YReSizer extends Widget {
  constructor(table) {
    super(`${cssPrefix}-re-sizer-vertical`);
    this.table = table;
    this.hoverEl = h('div', `${cssPrefix}-re-sizer-hover`);
    this.lineEl = h('div', `${cssPrefix}-re-sizer-line`);
    this.children(...[
      this.hoverEl,
      this.lineEl,
    ]);
  }

  init() {

  }

  setSize() {}

  setSize() {}
}

export { YReSizer };
