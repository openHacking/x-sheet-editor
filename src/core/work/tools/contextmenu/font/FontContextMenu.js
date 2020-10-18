import { ELContextMenu } from '../../../../../component/contextmenu/ELContextMenu';
import { cssPrefix, Constant } from '../../../../../const/Constant';
import { PlainUtils } from '../../../../../utils/PlainUtils';
import { FontContextMenuItem } from './FontContextMenuItem';


class FontContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-font-context-menu`, PlainUtils.mergeDeep({
      onUpdate: () => {},
    }, options));
    this.items = [
      new FontContextMenuItem('Arial'),
      new FontContextMenuItem('Helvetica'),
      new FontContextMenuItem('Source Sans Pro'),
      new FontContextMenuItem('Comic Sans Ms'),
      new FontContextMenuItem('Courier New'),
      new FontContextMenuItem('Verdana'),
      new FontContextMenuItem('Lalo'),
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

export { FontContextMenu };
