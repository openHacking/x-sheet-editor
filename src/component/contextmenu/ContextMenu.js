/* global document */

import { PopUp } from '../popup/PopUp';
import { cssPrefix } from '../../config';
import { EventBind } from '../../utils/EventBind';
import { Constant } from '../../utils/Constant';

class ContextMenu extends PopUp {
  constructor(className) {
    super(`${cssPrefix}-context-menu ${className}`, {});
    this.contextMenuArray = [];
    this.bind();
  }

  bind() {
    EventBind.bind(document.body, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.hide();
    });
  }

  addItem(contextMenuItem) {
    this.contextMenuArray.push(contextMenuItem);
    this.children(contextMenuItem);
  }
}

export { ContextMenu };
