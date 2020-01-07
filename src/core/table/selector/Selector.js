import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';
import { h } from '../../../lib/Element';

class Selector extends Widget {
  constructor() {
    super(`${cssPrefix}-selector`);
    this.cornerEl = h('div', `${cssPrefix}-selector-corner`);
    this.areaEl = h('div', `${cssPrefix}-selector-area`);
    this.areaEl.children(this.cornerEl);
    this.hide();
    this.children(this.areaEl);
  }
}

export { Selector };
