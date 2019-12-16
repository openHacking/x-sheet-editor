import { Element } from '../Element';
import { cssPrefix } from '../../config';
import { Utils } from '../../utils/Utils';

class HorizontalLayerElement extends Element {
  constructor(element, options) {
    super('div', `${cssPrefix}-horizontal-layer-element`);
    this.options = Utils.mergeDeep({
      style: {
        flexGrow: '0',
      },
    }, options);
    this.element = element;
    this.init();
  }

  init() {
    this.css(this.options.style);
    this.children(this.element);
  }
}

export { HorizontalLayerElement };
