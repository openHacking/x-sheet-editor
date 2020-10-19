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

  unbind() {
    XEvent.unbind(this);
  }

  bind() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.contextMenu.elPopUp.toggle();
      e.stopPropagation();
    });
  }

  addValue({
    text, value,
  }) {
    const item = new SelectContextMenuItem({ text, value });
    this.contextMenu.addItem(item);
  }

  addDivider() {
    const item = new ELContextMenuDivider();
    this.contextMenu.addItem(item);
  }

  destroy() {
    super.destroy();
    this.unbind();
    this.contextMenu.destroy();
  }

}

export {
  Select,
};
