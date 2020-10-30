import { Constant, cssPrefix } from '../../../const/Constant';
import { DropInputItem } from './base/DropInputItem';
import { XEvent } from '../../../lib/XEvent';
import { FontAngleValueContextMenu } from './contextmenu/fontanglevalue/FontAngleValueContextMenu';

class FontAngleValue extends DropInputItem {

  constructor() {
    super(`${cssPrefix}-tools-angle-value`);
    this.fontAngleValueContextMenu = new FontAngleValueContextMenu({
      el: this,
    });
    this.bind();
  }

  unbind() {
    const { icon } = this;
    XEvent.unbind(icon);
  }

  bind() {
    const { icon, fontAngleValueContextMenu } = this;
    XEvent.bind(icon, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      if (fontAngleValueContextMenu.isClose()) {
        fontAngleValueContextMenu.open();
      } else {
        fontAngleValueContextMenu.close();
      }
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  FontAngleValue,
};
