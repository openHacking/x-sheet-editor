import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';
import { h } from '../../../lib/Element';

class XReSizer extends Widget {
  constructor(table) {
    super(`${cssPrefix}-re-sizer-horizontal`);
    this.table = table;
    this.hoverEl = h('div', `${cssPrefix}-re-sizer-hover`);
    this.lineEl = h('div', `${cssPrefix}-re-sizer-line`);
    this.children(...[
      this.hoverEl,
      this.lineEl,
    ]);
  }
}

export { XReSizer };
