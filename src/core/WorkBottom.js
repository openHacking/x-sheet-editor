import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { BottomMenu } from './BottomMenu';

class WorkBottom extends Widget {
  constructor() {
    super(`${cssPrefix}-work-bottom`);
    this.bottomMenu = new BottomMenu();
    this.children(this.bottomMenu);
  }
}

export { WorkBottom };
