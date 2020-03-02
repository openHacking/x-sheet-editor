import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { Utils } from '../../utils/Utils';

class ColorItem extends Widget {
  constructor(options) {
    super(`${cssPrefix}-color-array-item`);
    this.options = Utils.mergeDeep({
      color: null,
      icon: null,
    }, options);
    if (this.options.color) {
      this.css('backgroundColor', this.options.color);
    }
    if (this.options.icon) {
      this.children(this.options.icon);
    }
  }
}

export { ColorItem };
