import { ELContextMenu } from '../../../component/elcontextmenu/ELContextMenu';
import { cssPrefix } from '../../../config';
import { Utils } from '../../../utils/Utils';
import { FontContextMenuItem } from './FontContextMenuItem';
import { Constant } from '../../../utils/Constant';

class FontContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-font-context-menu`, Utils.copyProp({
      onUpdate: () => {},
    }, options));
    this.addItem(new FontContextMenuItem('Arial').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update('Arial');
    }));
    this.addItem(new FontContextMenuItem('Helvetica').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update('Helvetica');
    }));
    this.addItem(new FontContextMenuItem('Source Sans Pro').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update('Source Sans Pro');
    }));
    this.addItem(new FontContextMenuItem('Comic Sans Ms').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update('Comic Sans Ms');
    }));
    this.addItem(new FontContextMenuItem('Courier New').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update('Courier New');
    }));
    this.addItem(new FontContextMenuItem('Verdana').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update('Verdana');
    }));
    this.addItem(new FontContextMenuItem('Lalo').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update('Lalo');
    }));
  }

  update(type) {
    const { options } = this;
    const { el } = options;
    options.onUpdate(type);
    el.setTitle(type);
    this.close();
  }
}

export { FontContextMenu };
