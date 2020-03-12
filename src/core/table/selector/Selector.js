import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';
import { h } from '../../../lib/Element';

class Selector extends Widget {
  constructor() {
    super(`${cssPrefix}-selector`);
    this.cornerEl = h('div', `${cssPrefix}-selector-corner`);
    this.areaEl = h('div', `${cssPrefix}-selector-area`);
    this.transfromData = h('div', `${cssPrefix}-selector-transform-data`);
    this.areaEl.children(this.cornerEl);
    this.children(this.transfromData);
    this.children(this.areaEl);
    this.hide();
  }
}

export { Selector };
