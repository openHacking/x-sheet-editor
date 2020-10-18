import { ELContextMenuItem } from '../../../contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../const/Constant';
import { h } from '../../../../lib/Element';

class SelectContextMenuItem extends ELContextMenuItem {

  constructor({
    text = '',
  }) {
    super(`${cssPrefix}-form-select-menu-item`);
    this.textEle = h('div', `${cssPrefix}-form-select-menu-item-title`);
    this.textEle.text(text);
    this.children(this.textEle);
  }

}

export {
  SelectContextMenuItem,
};
