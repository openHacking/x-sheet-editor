import { Item } from './base/Item';
import { cssPrefix } from '../../../config';

class Look extends Item {
  constructor() {
    super(`${cssPrefix}-tools-look`);
    this.setTitle('查看');
  }
}

export { Look };
