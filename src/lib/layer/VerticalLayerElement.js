import { cssPrefix } from '../../const/Constant';
import { Utils } from '../../utils/Utils';
import { Layer } from '../Layer';

class VerticalLayerElement extends Layer {
  constructor(options) {
    super(`${cssPrefix}-vertical-layer-element`);
    this.options = Utils.mergeDeep({
      style: {
        flexGrow: '0',
      },
    }, options);
    this.css(this.options.style);
  }
}

export { VerticalLayerElement };
