import { ELContextMenu } from '../../../../../component/elcontextmenu/ELContextMenu';
import { Utils } from '../../../../../utils/Utils';
import { cssPrefix, Constant } from '../../../../../constant/Constant';
import { FontSizeContextMenuItem } from './FontSizeContextMenuItem';


class FontSizeContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-font-size-context-menu`, Utils.mergeDeep({
      onUpdate: () => {},
    }, options));

    this.items = [
      new FontSizeContextMenuItem(6),
      new FontSizeContextMenuItem(7),
      new FontSizeContextMenuItem(8),
      new FontSizeContextMenuItem(9),
      new FontSizeContextMenuItem(10),
      new FontSizeContextMenuItem(11),
      new FontSizeContextMenuItem(12),
      new FontSizeContextMenuItem(14),
      new FontSizeContextMenuItem(15),
      new FontSizeContextMenuItem(18),
      new FontSizeContextMenuItem(24),
      new FontSizeContextMenuItem(36),
    ];
    this.items.forEach((item) => {
      item.on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
        this.update(item.size);
      });
      this.addItem(item);
    });
  }

  update(size) {
    const { options } = this;
    options.onUpdate(size);
    this.close();
  }

}

export { FontSizeContextMenu };
