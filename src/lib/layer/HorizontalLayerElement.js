import { cssPrefix } from '../../const/Constant';
import { Utils } from '../../utils/Utils';
import { Layer } from '../Layer';

class HorizontalLayerElement extends Layer {

  constructor(options) {
    super(`${cssPrefix}-horizontal-layer-element`);
    this.options = Utils.mergeDeep({
      style: {
        flexGrow: '0',
      },
    }, options);
    this.css(this.options.style);
  }
}

export { HorizontalLayerElement };
