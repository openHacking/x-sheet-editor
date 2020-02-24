import { ELContextMenu } from '../../../component/elcontextmenu/ELContextMenu';
import { Utils } from '../../../utils/Utils';
import { cssPrefix } from '../../../config';
import { FontSizeContextMenuItem } from './FontSizeContextMenuItem';
import { Constant } from '../../../utils/Constant';

class FontSizeContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-font-size-context-menu`, Utils.copyProp({
      onUpdate: () => {},
    }, options));
    this.items = [
      new FontSizeContextMenuItem('10'),
      new FontSizeContextMenuItem('15'),
      new FontSizeContextMenuItem('20'),
      new FontSizeContextMenuItem('25'),
      new FontSizeContextMenuItem('30'),
      new FontSizeContextMenuItem('35'),
      new FontSizeContextMenuItem('40'),
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
