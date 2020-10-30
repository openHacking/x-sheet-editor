import { ELContextMenu } from '../../../../../component/contextmenu/ELContextMenu';
import { cssPrefix } from '../../../../../const/Constant';
import { PlainUtils } from '../../../../../utils/PlainUtils';
import { FontAngleValueContextMenuItem } from './FontAngleValueContextMenuItem';

class FontAngleValueContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-font-angle-value-context-menu`, PlainUtils.mergeDeep({
      onUpdate: () => {},
    }, options));
    this.items = [
      new FontAngleValueContextMenuItem(-90),
      new FontAngleValueContextMenuItem(-75),
      new FontAngleValueContextMenuItem(-60),
      new FontAngleValueContextMenuItem(-45),
      new FontAngleValueContextMenuItem(-30),
      new FontAngleValueContextMenuItem(-15),
      new FontAngleValueContextMenuItem(-0),
      new FontAngleValueContextMenuItem(15),
      new FontAngleValueContextMenuItem(30),
      new FontAngleValueContextMenuItem(45),
      new FontAngleValueContextMenuItem(60),
      new FontAngleValueContextMenuItem(75),
      new FontAngleValueContextMenuItem(90),
    ];
    this.items.forEach((item) => {
      this.addItem(item);
    });
  }

}

export {
  FontAngleValueContextMenu,
};
