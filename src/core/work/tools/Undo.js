import { cssPrefix } from '../../../config';
import { Icon } from './Icon';
import { Item } from './base/Item';

class Undo extends Item {
  constructor() {
    super(`${cssPrefix}-tools-undo`);
    this.icon = new Icon('undo');
    this.children(this.icon);
  }
}

export { Undo };
