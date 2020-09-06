import { Widget } from '../../../../lib/Widget';
import { cssPrefix } from '../../../../const/Constant';
import { h } from '../../../../lib/Element';

class DropRowFixed extends Widget {

  constructor() {
    super(`${cssPrefix}-table-drop-row-fixed-bar`);
    this.block = h('div', `${cssPrefix}-table-drop-row-fixed-block`);
    this.children(this.block);
  }

  setTop(px) {

  }

}

export {
  DropRowFixed,
};
