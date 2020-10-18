/* global document */
import { cssPrefix, Constant } from '../../const/Constant';
import { XEvent } from '../../lib/XEvent';
import { Widget } from '../../lib/Widget';
import { ElPopUp } from '../elpopup/ElPopUp';
import { PlainUtils } from '../../utils/PlainUtils';

class ELContextMenu extends Widget {

  constructor(className = '', options = {}) {
    super(`${cssPrefix}-el-context-menu ${className}`);
    this.options = PlainUtils.mergeDeep({}, options);
    this.menus = [];
    this.elPopUp = new ElPopUp(this.options);
    this.elPopUp.children(this);
    this.globalHandle = () => {
      this.close();
    };
    XEvent.bind(document.body, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.globalHandle);
  }

  addItem(item) {
    const { menus } = this;
    menus.push(item);
    this.children(item);
    return this;
  }

  isOpen() {
    return this.elPopUp.off;
  }

  open() {
    this.monopoly();
    this.elPopUp.open();
    return this;
  }

  close() {
    this.elPopUp.close();
    return this;
  }

  destroy() {
    const { elPopUp } = this;
    XEvent.unbind(document.body, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.globalHandle);
    elPopUp.destroy();
  }

}

export { ELContextMenu };
