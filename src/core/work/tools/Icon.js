import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';
import { h } from '../../../lib/Element';

class Icon extends Widget {
  constructor(className = '') {
    super(`${cssPrefix}-icon`);
    this.iconNameEl = h('div', `${cssPrefix}-icon-img ${className}`);
    this.child(this.iconNameEl);
  }

  setWidth(width) {
    this.css('width', `${width}px`);
  }

  setHeight(height) {
    this.css('height', `${height}px`);
  }
}

export { Icon };
