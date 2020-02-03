import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { TopMenu } from './TopMenu';

class WorkTop extends Widget {
  constructor(work) {
    super(`${cssPrefix}-work-top`);
    this.work = work;
    this.toolsMenu = new TopMenu(this);
    this.children(this.toolsMenu);
  }
}

export { WorkTop };
