import { Widget } from '../../../../lib/Widget';
import { cssPrefix } from '../../../../const/Constant';

class XScreenLTZone extends Widget {

  constructor(xScreen) {
    super(`${cssPrefix}-xScreen-lt-zone`);
    this.xScreen = xScreen;
  }

}

export {
  XScreenLTZone,
};
