import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { Item } from './base/Item';

class Fixed extends Item {
  constructor() {
    super(`${cssPrefix}-tools-fixed`);
    this.icon = new Icon('freeze');
    this.children(this.icon);
  }
}

export { Fixed };
