import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { cssPrefix, Constant } from '../../../../../../const/Constant';
import { SheetUtils } from '../../../../../../utils/SheetUtils';
import { FontContextMenuItem } from './FontContextMenuItem';
import { XEvent } from '../../../../../../lib/XEvent';

class FontContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-font-context-menu`, SheetUtils.copy({
      onUpdate: () => {},
    }, options));
    this.items = [
      new FontContextMenuItem('Source Sans Pro'),
      new FontContextMenuItem('Verdana'),
      new FontContextMenuItem('Arial'),
      new FontContextMenuItem('Helvetica'),
      new FontContextMenuItem('Lalo'),
      new FontContextMenuItem('Comic Sans Ms'),
      new FontContextMenuItem('Courier New'),
      new FontContextMenuItem('宋体'),
      new FontContextMenuItem('等线'),
      new FontContextMenuItem('黑体'),
      new FontContextMenuItem('华文中宋'),
      new FontContextMenuItem('微软雅黑'),
    ];
    this.items.forEach((item) => {
      this.addItem(item);
    });
    this.setActiveByType(this.items[0].title);
    this.bind();
  }

  update(type) {
    const { options } = this;
    options.onUpdate(type);
    this.close();
  }

  unbind() {
    this.items.forEach((item) => {
      XEvent.unbind(item);
    });
  }

  bind() {
    this.items.forEach((item) => {
      XEvent.bind(item, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
        this.update(item.title);
        item.setActive();
      });
    });
  }

  setActiveByType(type) {
    this.items.forEach((item) => {
      if (item.title === type) {
        item.setActive();
      }
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { FontContextMenu };
