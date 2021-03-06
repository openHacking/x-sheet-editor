import { Item } from './Item';
import { cssPrefix } from '../../../../../const/Constant';
import { Icon } from '../Icon';
import { h } from '../../../../../lib/Element';

class DropInputItem extends Item {

  constructor(className) {
    super(`${cssPrefix}-tools-drop-input-item ${className}`);
    this.drop = h('div', `${cssPrefix}-tools-drop-input-item-mark`);
    this.title = h('div', `${cssPrefix}-tools-drop-input-item-title`);
    this.icon = new Icon('arrow-down');
    this.input = h('input', `${cssPrefix}-tools-drop-input`);
    this.drop.childrenNodes(this.icon);
    this.title.childrenNodes(this.input);
    this.childrenNodes(this.title);
    this.childrenNodes(this.drop);
  }

  setValue(value) {
    this.input.val(value);
    return this;
  }

}

export { DropInputItem };
