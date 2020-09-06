import { Widget } from '../../../../lib/Widget';
import { cssPrefix } from '../../../../const/Constant';
import { h } from '../../../../lib/Element';

class DropColFixed extends Widget {

  constructor() {
    super(`${cssPrefix}-table-drop-col-fixed-bar`);
    this.block = h('div', `${cssPrefix}-table-drop-col-fixed-block`);
    this.children(this.block);
  }

  setLeft(px) {

  }

}

export {
  DropColFixed,
};
