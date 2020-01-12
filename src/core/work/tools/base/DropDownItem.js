import { Item } from './Item';
import { cssPrefix } from '../../../../config';
import { h } from '../../../../lib/Element';
import { Icon } from '../Icon';

class DropDownItem extends Item {
  constructor(className) {
    super(`${cssPrefix}-tools-drop-down-item ${className}`);
    this.drop = h('div', `${cssPrefix}-tools-drop-down-item-mark`);
    this.title = h('div', `${cssPrefix}-tools-drop-down-item-title`);
    this.drop.children(new Icon('arrow-down'));
    this.children(this.title);
    this.children(this.drop);
  }

  setTitle(text) {
    this.title.text(text);
  }

  setIcon(icon) {
    this.title.children(icon);
  }
}

export { DropDownItem };
