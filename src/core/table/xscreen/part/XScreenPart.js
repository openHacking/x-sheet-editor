import { Widget } from '../../../../lib/Widget';

class XScreenPart extends Widget {

  constructor(className) {
    super(className);
    this.xScreenZone = null;
  }

  onAttach(xScreenZone) {
    this.xScreenZone = xScreenZone;
  }

}

export {
  XScreenPart,
};
