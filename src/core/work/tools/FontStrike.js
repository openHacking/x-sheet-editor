import { Item } from './base/Item';
import { cssPrefix } from '../../../config';
import { Icon } from './Icon';

class FontStrike extends Item {
  constructor() {
    super(`${cssPrefix}-tools-font-strike`);
    this.icon = new Icon('font-strike');
    this.children(this.icon);
  }
}

export { FontStrike };
