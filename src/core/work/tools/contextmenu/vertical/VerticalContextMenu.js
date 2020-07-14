import { ELContextMenu } from '../../../../../component/elcontextmenu/ELContextMenu';
import { cssPrefix, Constant } from '../../../../../const/Constant';
import { Utils } from '../../../../../utils/Utils';
import { h } from '../../../../../lib/Element';
import { VerticalContextMenuItem } from './VerticalContextMenuItem';
import { VerticalIcon1 } from '../icon/vertical/VerticalIcon1';
import { VerticalIcon2 } from '../icon/vertical/VerticalIcon2';
import { VerticalIcon3 } from '../icon/vertical/VerticalIcon3';
import { EventBind } from '../../../../../utils/EventBind';

import { VERTICAL_ALIGN } from '../../../../../canvas/Font';

class VerticalContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-vertical-type-context-menu`, Utils.mergeDeep({
      onUpdate: () => {},
    }, options));
    this.verticalIcon1 = new VerticalIcon1();
    this.verticalIcon2 = new VerticalIcon2();
    this.verticalIcon3 = new VerticalIcon3();
    const div2 = h('div', `${cssPrefix}-vertical-type-context-menu-type-icon-line`);
    div2.children(this.verticalIcon1);
    div2.children(this.verticalIcon2);
    div2.children(this.verticalIcon3);
    this.verticalIcons = new VerticalContextMenuItem();
    this.verticalIcons.removeClass('hover');
    this.verticalIcons.children(div2);
    this.addItem(this.verticalIcons);
    // 添加事件
    EventBind.bind(this.verticalIcon1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(VERTICAL_ALIGN.top);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.verticalIcon2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(VERTICAL_ALIGN.center);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.verticalIcon3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(VERTICAL_ALIGN.bottom);
      e.stopPropagation();
      e.preventDefault();
    });
  }
}

export { VerticalContextMenu };
