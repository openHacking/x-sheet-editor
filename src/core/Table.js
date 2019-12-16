import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { h } from '../lib/Element';

class Table extends Widget {
  constructor() {
    super(`${cssPrefix}-table`);
    this.canvas = h('canvas', `${cssPrefix}-canvas`);
  }
}

export { Table };
