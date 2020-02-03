import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { BottomMenu } from './BottomMenu';

class WorkBottom extends Widget {
  constructor(work) {
    super(`${cssPrefix}-work-bottom`);
    this.work = work;
    this.bottomMenu = new BottomMenu();
    this.children(this.bottomMenu);
  }
}

export { WorkBottom };
