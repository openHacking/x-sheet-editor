import { cssPrefix } from '../../../const/Constant';
import { Widget } from '../../../lib/Widget';
import { Utils } from '../../../utils/Utils';

class XScreenWidget extends Widget {

  constructor({
    xScreen, groupId,
  }) {
    super(`${cssPrefix}-screen-widget`);
    this.groupId = groupId || Utils.uuid();
    this.xScreen = xScreen;
  }

  clone() {
    const { xScreen, groupId } = this;
    return new this.constructor({
      xScreen, groupId,
    });
  }

  setBottom() {}

  setLeft() {}

  setTop() {}

  setRight() {}

  setWidth() {}

  setHeight() {}

}

export {
  XScreenWidget,
};
