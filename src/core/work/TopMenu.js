import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';

class TopMenu extends Widget {
  constructor() {
    super(`${cssPrefix}-tools-menu`);
  }
}

export { TopMenu };
