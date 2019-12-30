import { cssPrefix } from '../../config';
import { Widget } from '../../lib/Widget';
import { h } from '../../lib/Element';

const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <rect class="${cssPrefix}-selector-clipboard-stroked" x="0" y="0" width="100%" height="100%" />
  </svg>
`;

class SelectorElement extends Widget {
  constructor(selector) {
    super(`${cssPrefix}-selector-element`);
    this.selector = selector;
    this.cornerEl = h('div', `${cssPrefix}-selector-corner`);
    this.areaEl = h('div', `${cssPrefix}-selector-area`).hide();
    this.autofillEl = h('div', `${cssPrefix}-selector-auto-fill`).hide();
    this.clipboardEl = h('div', `${cssPrefix}-selector-clipboard`).hide();
    this.areaEl.children(this.cornerEl);
    this.clipboardEl.html(svg);
    this.children(this.areaEl, this.clipboardEl, this.autofillEl);
  }
}

export { SelectorElement };
