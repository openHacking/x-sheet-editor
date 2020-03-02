import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { Utils } from '../../utils/Utils';

class ColorItem extends Widget {
  constructor(options) {
    super(`${cssPrefix}-color-array-item`);
    this.options = Utils.mergeDeep({
      color: 'rgb(0,0,0)',
    }, options);
    this.css('backgroundColor', this.options.color);
  }
}

export { ColorItem };
