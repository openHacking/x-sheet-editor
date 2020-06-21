import { cssPrefix } from '../../constant/Constant';
import { Utils } from '../../utils/Utils';
import { Layer } from '../Layer';

class VerticalLayer extends Layer {

  constructor(options) {
    super(`${cssPrefix}-vertical-layer`);
    this.options = Utils.mergeDeep({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { VerticalLayer };
