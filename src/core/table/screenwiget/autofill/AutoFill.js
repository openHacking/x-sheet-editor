import { cssPrefix } from '../../../../constant/Constant';
import { Widget } from '../../../../lib/Widget';
import { h } from '../../../../lib/Element';

class AutoFill extends Widget {
  constructor() {
    super(`${cssPrefix}-autofill`);
    this.areaEl = h('div', `${cssPrefix}-autofill-area`);
    this.children(this.areaEl);
    this.hide();
  }
}

export { AutoFill };
