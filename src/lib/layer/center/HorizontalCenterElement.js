import { cssPrefix } from '../../../constant/Constant';
import { Utils } from '../../../utils/Utils';
import { Layer } from '../../Layer';

class HorizontalCenterElement extends Layer {

  constructor(element, options) {
    super(`${cssPrefix}-horizontal-center-element`);
    this.options = Utils.mergeDeep({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { HorizontalCenterElement };
