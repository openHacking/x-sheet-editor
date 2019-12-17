import { Element } from '../Element';
import { cssPrefix } from '../../config';
import { Utils } from '../../utils/Utils';

class LayerBar extends Element {
  constructor(element, options) {
    super('div', `${cssPrefix}-layer-bar`);
    this.options = Utils.mergeDeep({
      style: {},
    }, options);
    this.element = element;
    this.init();
  }

  init() {
    this.css(this.options.style);
    this.children(this.element);
  }
}

export { LayerBar };
