import { Element } from '../Element';
import { cssPrefix } from '../../config';
import { Utils } from '../../utils/Utils';

class HorizontalLayer extends Element {
  constructor(options) {
    super('div', `${cssPrefix}-horizontal-layer`);
    this.options = Utils.mergeDeep({
      layerElements: [],
      style: {},
    }, options);
    this.init();
  }

  init() {
    this.css(this.options.style);
    // eslint-disable-next-line no-restricted-syntax
    for (const layerElement of this.options.layerElements) this.children(layerElement);
  }
}

export { HorizontalLayer };