import { Item } from './base/Item';
import { cssPrefix } from '../../../config';

class Insert extends Item {
  constructor() {
    super(`${cssPrefix}-tools-insert`);
    this.setTitle('插入');
  }
}

export { Insert };
