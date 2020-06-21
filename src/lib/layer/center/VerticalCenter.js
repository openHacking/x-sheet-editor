import { cssPrefix } from '../../../constant/Constant';
import { Utils } from '../../../utils/Utils';
import { Layer } from '../../Layer';

class VerticalCenter extends Layer {
  constructor(options) {
    super('div', `${cssPrefix}-vertical-center`);
    this.options = Utils.mergeDeep({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { VerticalCenter };
