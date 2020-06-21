import { cssPrefix } from '../../constant/Constant';
import { Utils } from '../../utils/Utils';
import { Layer } from '../Layer';

class HorizontalLayer extends Layer {

  constructor(options) {
    super(`${cssPrefix}-horizontal-layer`);
    this.options = Utils.mergeDeep({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { HorizontalLayer };
