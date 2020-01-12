import { Widget } from '../../../../lib/Widget';
import { cssPrefix } from '../../../../config';

class Item extends Widget {
  constructor(className) {
    super(`${cssPrefix}-tools-item ${className}`);
  }
}

export { Item };
