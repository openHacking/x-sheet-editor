import { Element } from '../../Element';
import { cssPrefix } from '../../../config';
import { Utils } from '../../../utils/Utils';

class VerticalCenter extends Element {
  constructor(options) {
    super('div', `${cssPrefix}-vertical-center`);
    this.options = Utils.mergeDeep({
      centerElements: [],
      style: {},
    }, options);
    this.init();
  }

  init() {
    this.css(this.options.style);
    // eslint-disable-next-line no-restricted-syntax
    for (const centerElement of this.options.centerElements) this.children(centerElement);
  }
}

export { VerticalCenter };
