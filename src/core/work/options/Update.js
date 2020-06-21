import { Item } from './base/Item';
import { cssPrefix } from '../../../constant/Constant';

class Update extends Item {
  constructor() {
    super(`${cssPrefix}-tools-update`);
    this.setTitle('修改');
  }
}

export { Update };
