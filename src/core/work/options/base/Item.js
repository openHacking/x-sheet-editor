import { Widget } from '../../../../lib/Widget';
import { cssPrefix } from '../../../../constant/Constant';

class Item extends Widget {
  constructor(className) {
    super(`${cssPrefix}-option-item ${className}`);
    this.title = '';
  }

  setTitle(title) {
    this.title = title;
    this.text(this.title);
  }
}

export { Item };
