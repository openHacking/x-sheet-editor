import { h } from '../lib/Element';
import { cssPrefix } from '../config';
import { Widget } from '../lib/Widget';

class SelectorElement extends Widget {
  constructor() {
    super(`${cssPrefix}-selector-element`);
    this.cornerEl = h('div', `${cssPrefix}-selector-corner`);
    this.areaEl = h('div', `${cssPrefix}-selector-area`);
    this.clipboardEl = h('div', `${cssPrefix}-selector-clipboard`).hide();
    this.autofillEl = h('div', `${cssPrefix}-selector-auto-fill`).hide();
    this.areaEl.children(this.cornerEl).hide();
    this.children(this.areaEl, this.clipboardEl, this.autofillEl);
  }
}

export { SelectorElement };
