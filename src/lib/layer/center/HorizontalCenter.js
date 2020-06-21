import { cssPrefix } from '../../../constant/Constant';
import { Utils } from '../../../utils/Utils';
import { Layer } from '../../Layer';

class HorizontalCenter extends Layer {

  constructor(options) {
    super(`${cssPrefix}-horizontal-center`);
    this.options = Utils.mergeDeep({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { HorizontalCenter };
