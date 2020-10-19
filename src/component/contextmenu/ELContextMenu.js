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
    this.eLContextCloseHandle = () => {
      this.close();
    };
    this.bind();
  }

  unbind() {
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.eLContextCloseHandle);
  }

  bind() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      e.stopPropagation();
    });
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.eLContextCloseHandle);
  }

  addItem(item) {
    const { menus } = this;
    menus.push(item);
    this.children(item);
    return this;
  }

  isOpen() {
    return this.elPopUp.status;
  }

  open() {
    this.elPopUp.open();
    return this;
  }

  close() {
    this.elPopUp.close();
    return this;
  }

  destroy() {
    super.destroy();
    this.unbind();
    this.elPopUp.destroy();
  }

}

export { ELContextMenu };
