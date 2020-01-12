import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { Undo } from '../../component/tools/Undo';

class TopMenu extends Widget {
  constructor() {
    super(`${cssPrefix}-tools-menu`);
    this.undo = new Undo();
    this.children(this.undo);
  }
}

export { TopMenu };
