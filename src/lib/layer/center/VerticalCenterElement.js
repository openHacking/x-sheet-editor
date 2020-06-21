import { cssPrefix } from '../../../constant/Constant';
import { Utils } from '../../../utils/Utils';
import { Layer } from '../../Layer';

class VerticalCenterElement extends Layer {

  constructor(options) {
    super(`${cssPrefix}-vertical-center-element`);
    this.options = Utils.mergeDeep({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { VerticalCenterElement };
