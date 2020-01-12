import { Item } from './base/Item';
import { cssPrefix } from '../../../config';
import { Icon } from './Icon';

class PaintFormat extends Item {
  constructor() {
    super(`${cssPrefix}-tools-point-format`);
    this.icon = new Icon('point-format');
    this.children(this.icon);
  }
}

export { PaintFormat };
