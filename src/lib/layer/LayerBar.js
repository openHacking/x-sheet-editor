import { cssPrefix } from '../../constant/Constant';
import { Utils } from '../../utils/Utils';
import { Layer } from '../Layer';

class LayerBar extends Layer {

  constructor(options) {
    super(`${cssPrefix}-layer-bar`);
    this.options = Utils.mergeDeep({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { LayerBar };
