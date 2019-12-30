import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { TopMenu } from './TopMenu';

class WorkTop extends Widget {
  constructor() {
    super(`${cssPrefix}-work-top`);
    this.toolsMenu = new TopMenu();
    this.children(this.toolsMenu);
  }
}

export { WorkTop };
