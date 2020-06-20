/* global document */
import { cssPrefix } from '../../config';
import { EventBind } from '../../utils/EventBind';
import { Constant } from '../../core/constant/Constant';
import { Widget } from '../../lib/Widget';
import { ElPopUp } from '../elpopup/ElPopUp';
import { Utils } from '../../utils/Utils';

class ELContextMenu extends Widget {

  constructor(className = '', options = {}) {
    super(`${cssPrefix}-el-context-menu ${className}`);
    this.options = Utils.mergeDeep({}, options);
    this.menus = [];
    // 环绕元素弹层组件
    this.elPopUp = new ElPopUp(this.options);
    this.elPopUp.children(this);
    this.bind();
  }

  bind() {
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (event) => {
      event.stopPropagation();
      event.preventDefault();
    });
    EventBind.bind(document.body, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
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
