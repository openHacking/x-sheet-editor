import { ELContextMenu } from '../../../../../component/elcontextmenu/ELContextMenu';
import { Utils } from '../../../../../utils/Utils';
import { cssPrefix } from '../../../../../config';
import { LineTypeContextMenuItem } from './LineTypeContextMenuItem';
import { Constant } from '../../../../../utils/Constant';

class LineTypeContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-line-type-context-menu`, Utils.mergeDeep({
      onUpdate: () => {},
    }, options));
    this.items = [
      new LineTypeContextMenuItem('Arial'),
      new LineTypeContextMenuItem('Helvetica'),
      new LineTypeContextMenuItem('Source Sans Pro'),
      new LineTypeContextMenuItem('Comic Sans Ms'),
      new LineTypeContextMenuItem('Courier New'),
      new LineTypeContextMenuItem('Verdana'),
      new LineTypeContextMenuItem('Lalo'),
    ];
    this.items.forEach((item) => {
      item.on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
        this.update(item.title);
        item.setActive();
      });
      this.addItem(item);
    });
    this.setActiveByType(this.items[0].title);
  }

  update(type) {
    const { options } = this;
    options.onUpdate(type);
    this.close();
  }

  setActiveByType(type) {
    this.items.forEach((item) => {
      if (item.title === type) {
        item.setActive();
      }
    });
  }
}

export { LineTypeContextMenu };
