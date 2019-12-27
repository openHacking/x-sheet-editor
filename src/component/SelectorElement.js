import { h } from '../lib/Element';
import { cssPrefix } from '../config';
import { Widget } from '../lib/Widget';

const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
    <rect class="${cssPrefix}-selector-clipboard-stroked" x="0" y="0" width="300" height="200" />
  </svg>
`;

class SelectorElement extends Widget {
  constructor() {
    super(`${cssPrefix}-selector-element`);
    this.cornerEl = h('div', `${cssPrefix}-selector-corner`);
    this.areaEl = h('div', `${cssPrefix}-selector-area`);
    this.autofillEl = h('div', `${cssPrefix}-selector-auto-fill`).hide();
    this.clipboardEl = h('div', `${cssPrefix}-selector-clipboard`).hide();
    this.areaEl.children(this.cornerEl);
    this.clipboardEl.html(svg);
    this.children(this.areaEl.show(), this.clipboardEl.show(), this.autofillEl.show());
  }
}

export { SelectorElement };
