import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { ToolsMenu } from './ToolsMenu';

class WorkTop extends Widget {
  constructor() {
    super(`${cssPrefix}-work-top`);
    this.toolsMenu = new ToolsMenu();
    this.children(this.toolsMenu);
  }
}

export { WorkTop };
