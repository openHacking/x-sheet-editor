import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { TopMenu } from './TopMenu';
import { TopOption } from './TopOption';

class WorkTop extends Widget {
  constructor(work) {
    super(`${cssPrefix}-work-top`);
    this.work = work;
    this.toolsMenu = new TopMenu(this);
    this.option = new TopOption(this);
    this.children(this.option);
    this.children(this.toolsMenu);
  }
}

export { WorkTop };
