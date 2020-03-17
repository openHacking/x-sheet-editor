import { cssPrefix } from '../../../../config';
import { Icon } from '../Icon';
import { Item } from '../base/Item';

class TextWrappingIcon1 extends Item {
  constructor() {
    super(`${cssPrefix}-tools-text-wrapping1`);
    this.icon = new Icon('truncate');
    this.children(this.icon);
  }
}

export { TextWrappingIcon1 };
