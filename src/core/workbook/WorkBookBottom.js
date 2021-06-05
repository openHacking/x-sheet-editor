import { Widget } from '../../libs/Widget';
import { cssPrefix } from '../../const/Constant';
import { WorkBookBottomMenu } from './WorkBookBottomMenu';

class WorkBookBottom extends Widget {

  constructor(work) {
    super(`${cssPrefix}-work-bottom`);
    this.work = work;
  }

  onAttach() {
    this.bottomMenu = new WorkBookBottomMenu(this);
    this.attach(this.bottomMenu);
  }

}

export { WorkBookBottom };
