import { Item } from './base/Item';
import { cssPrefix } from '../../../constant/Constant';

class Look extends Item {
  constructor() {
    super(`${cssPrefix}-tools-look`);
    this.setTitle('查看');
  }
}

export { Look };
