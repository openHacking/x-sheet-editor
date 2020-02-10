/* global document */
import { cssPrefix } from '../../config';
import { EventBind } from '../../utils/EventBind';
import { Constant } from '../../utils/Constant';
import { ElPopUp } from '../elpopup/ElPopUp';

class ELContextMenu extends ElPopUp {
  constructor(className = '', options = {}) {
    super(`${cssPrefix}-el-context-menu ${className}`, options);
    this.contextMenuArray = [];
  }

  bind() {
    super.bind();
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (event) => {
      event.stopPropagation();
      event.preventDefault();
    });
    EventBind.bind(document.body, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.close();
    });
  }

  addItem(contextMenuItem) {
    this.contextMenuArray.push(contextMenuItem);
    this.content.children(contextMenuItem);
  }
}

export { ELContextMenu };
