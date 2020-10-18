import { Widget } from '../../../lib/Widget';
import { Constant, cssPrefix } from '../../../const/Constant';
import { EL_POPUP_POSITION } from '../../elpopup/ElPopUp';
import { h } from '../../../lib/Element';
import { XEvent } from '../../../lib/XEvent';
import { ELContextMenuDivider } from '../../contextmenu/ELContextMenuDivider';
import { SelectContextMenu } from './contextmenu/SelectContextMenu';
import { SelectContextMenuItem } from './contextmenu/SelectContextMenuItem';

class Select extends Widget {

  constructor() {
    super(`${cssPrefix}-form-select`);
    this.status = false;
    this.contextMenu = new SelectContextMenu({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    });
    this.selectText = h('div', `${cssPrefix}-form-select-text`);
    this.selectIcon = h('div', `${cssPrefix}-form-select-icon`);
    this.children(this.selectText);
    this.children(this.selectIcon);
    this.bind();
  }

  bind() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      if (this.status) {
        this.hideMenu();
      } else {
        this.showMenu();
      }
    });
  }

  addDivider() {
    const item = new ELContextMenuDivider();
    this.contextMenu.addItem(item);
  }

  addValue({
    text, value,
  }) {
    const item = new SelectContextMenuItem({ text, value });
    this.contextMenu.addItem(item);
  }

  showMenu() {
    this.status = true;
    this.contextMenu.open();
  }

  hideMenu() {
    this.status = false;
    this.contextMenu.close();
  }

}

export {
  Select,
};
