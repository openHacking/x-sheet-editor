import { Widget } from '../../../lib/Widget';
import { Utils } from '../../../utils/Utils';
import { cssPrefix } from '../../../config';
import { h } from '../../../lib/Element';

const svg = `
  <svg class="${cssPrefix}-copy-style-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <line class="${cssPrefix}-copy-style-stroked-top" x1="0" y1="0" x2="100%" y2="0"/>
    <line class="${cssPrefix}-copy-style-stroked-left" x1="0" y1="0" x2="0" y2="100%"/>
    <line class="${cssPrefix}-copy-style-stroked-bottom" x1="0" y1="100%" x2="100%" y2="100%"/>
    <line class="${cssPrefix}-copy-style-stroked-right" x1="100%" y1="0" x2="100%" y2="100%"/>
  </svg>
`;

class CopyStyle extends Widget {
  constructor(options) {
    super(`${cssPrefix}-copy-style`);
    this.options = Utils.mergeDeep({}, options);
    this.mask = h('div', `${cssPrefix}-copy-style-mask`);
    this.html(svg);
    this.children(this.mask);
    this.top = this.find(`.${cssPrefix}-copy-style-stroked-top`);
    this.left = this.find(`.${cssPrefix}-copy-style-stroked-left`);
    this.bottom = this.find(`.${cssPrefix}-copy-style-stroked-bottom`);
    this.right = this.find(`.${cssPrefix}-copy-style-stroked-right`);
    this.hide();
  }
}

export { CopyStyle };