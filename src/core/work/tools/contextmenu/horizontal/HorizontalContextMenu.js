import { ELContextMenu } from '../../../../../component/elcontextmenu/ELContextMenu';
import { cssPrefix, Constant } from '../../../../../const/Constant';
import { Utils } from '../../../../../utils/Utils';
import { h } from '../../../../../lib/Element';
import { HorizontalIcon1 } from '../icon/horizontal/HorizontalIcon1';
import { HorizontalIcon2 } from '../icon/horizontal/HorizontalIcon2';
import { HorizontalIcon3 } from '../icon/horizontal/HorizontalIcon3';
import { HorizontalContextMenuItem } from './HorizontalContextMenuItem';
import { EventBind } from '../../../../../utils/EventBind';

import { ALIGN } from '../../../../../canvas/Font';

class HorizontalContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-horizontal-type-context-menu`, Utils.mergeDeep({
      onUpdate: () => {},
    }, options));
    this.horizontalIcon1 = new HorizontalIcon1();
    this.horizontalIcon2 = new HorizontalIcon2();
    this.horizontalIcon3 = new HorizontalIcon3();
    const div2 = h('div', `${cssPrefix}-horizontal-type-context-menu-type-icon-line`);
    div2.children(this.horizontalIcon1);
    div2.children(this.horizontalIcon2);
    div2.children(this.horizontalIcon3);
    this.horizontalIcons = new HorizontalContextMenuItem();
    this.horizontalIcons.removeClass('hover');
    this.horizontalIcons.children(div2);
    this.addItem(this.horizontalIcons);
    // 添加事件
    EventBind.bind(this.horizontalIcon1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(ALIGN.left);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.horizontalIcon2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(ALIGN.center);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.horizontalIcon3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(ALIGN.right);
      e.stopPropagation();
      e.preventDefault();
    });
  }
}

export { HorizontalContextMenu };
