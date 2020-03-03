import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { Utils } from '../../utils/Utils';
import { h } from '../../lib/Element';
import { Icon } from '../../core/work/tools/Icon';

class ColorItem extends Widget {
  constructor(options) {
    super(`${cssPrefix}-color-array-item`);
    this.options = Utils.mergeDeep({
      color: null,
      icon: null,
    }, options);
    if (this.options.color) {
      this.css('backgroundColor', this.options.color);
      this.mask = h('div', `${cssPrefix}-color-array-item-mask`);
      this.children(this.mask);
      this.mask.hide();
      if (Utils.isDarkRGB(this.options.color)) {
        this.mask.children(new Icon('checked-dark'));
      } else {
        this.mask.children(new Icon('checked-light'));
      }
    }
    if (this.options.icon) {
      this.children(this.options.icon);
    }
  }

  setActive(active) {
    if (this.mask) {
      if (active) {
        this.mask.show();
      } else {
        this.mask.hide();
      }
    }
  }
}

export { ColorItem };
