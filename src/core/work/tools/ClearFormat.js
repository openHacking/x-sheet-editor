import { Item } from './base/Item';
import { cssPrefix } from '../../../config';
import { Icon } from './Icon';

class ClearFormat extends Item {
  constructor() {
    super(`${cssPrefix}-tools-clear-format`);
    this.icon = new Icon('clear-format');
    this.children(this.icon);
  }
}

export { ClearFormat };
