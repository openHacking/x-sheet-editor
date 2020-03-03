import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { Utils } from '../../utils/Utils';
import { Icon } from '../../core/work/tools/Icon';

class ColorItem extends Widget {
  constructor(options) {
    super(`${cssPrefix}-color-array-item`);
    this.options = Utils.mergeDeep({
      color: null,
      icon: null,
    }, options);
    this.color = this.options.color;
    this.icon = this.options.icon;
    if (this.color) {
      this.css('backgroundColor', this.color);
      if (Utils.isDarkRGB(this.options.color)) {
        this.checkedIcon = new Icon('checked-dark');
        this.children(this.checkedIcon);
      } else {
        this.checkedIcon = new Icon('checked-light');
        this.children(this.checkedIcon);
      }
    }
    if (this.icon) {
      this.children(this.options.icon);
    }
  }

  setActive(active) {
    if (this.checkedIcon) {
      if (active) {
        this.checkedIcon.show();
      } else {
        this.checkedIcon.hide();
      }
    }
  }
}

export { ColorItem };
