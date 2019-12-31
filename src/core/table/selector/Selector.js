import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';
import { h } from '../../../lib/Element';

class Selector extends Widget {
  constructor() {
    super(`${cssPrefix}-selector`);
    this.cornerEl = h('div', `${cssPrefix}-selector-corner`);
    this.areaEl = h('div', `${cssPrefix}-selector-area`);
    this.autofillEl = h('div', `${cssPrefix}-selector-auto-fill`).hide();
    this.areaEl.children(this.cornerEl);
    this.hide();
    this.children(this.areaEl, this.autofillEl);
  }
}

export { Selector };
