import { Widget } from '../../../../lib/Widget';
import { cssPrefix } from '../../../../constant/Constant';

class Item extends Widget {
  constructor(className) {
    super(`${cssPrefix}-tools-item ${className}`);
  }
}

export { Item };
