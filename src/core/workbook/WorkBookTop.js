import { Widget } from '../../libs/Widget';
import { cssPrefix } from '../../const/Constant';
import { WorkBookTopMenu } from './WorkBookTopMenu';
import { WorkBookTopOption } from './WorkBookTopOption';
import { PlainUtils } from '../../utils/PlainUtils';

const settings = {
  option: {
    show: true,
  },
};

class WorkBookTop extends Widget {

  constructor(work, options) {
    super(`${cssPrefix}-work-top`);
    this.options = PlainUtils.copy({}, settings, options);
    this.work = work;
  }

  onAttach() {
    this.option = new WorkBookTopOption(this, this.options.option);
    this.toolsMenu = new WorkBookTopMenu(this, this.options.menu);
    if (this.options.option.show) {
      this.attach(this.option);
    }
    if (this.options.menu.show) {
      this.attach(this.toolsMenu);
    }
  }

}

export { WorkBookTop };
