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
    // 环绕元素弹层组件
    this.elPopUp = new ElPopUp(this.options);
    this.elPopUp.children(this);
    this.bind();
  }

  bind() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (event) => {
      event.stopPropagation();
      event.preventDefault();
    });
    XEvent.bind(document.body, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.close();
    });
  }

  addItem(item) {
    const { menus } = this;
    menus.push(item);
    this.children(item);
    return this;
  }

  open() {
    this.elPopUp.open();
    return this;
  }

  close() {
    this.elPopUp.close();
    return this;
  }

  isOpen() {
    return this.elPopUp.off;
  }
}

export { ELContextMenu };
