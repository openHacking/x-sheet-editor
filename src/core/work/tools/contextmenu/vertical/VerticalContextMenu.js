import { ELContextMenu } from '../../../../../component/elcontextmenu/ELContextMenu';
import { cssPrefix, Constant } from '../../../../../const/Constant';
import { PlainUtils } from '../../../../../utils/PlainUtils';
import { h } from '../../../../../lib/Element';
import { VerticalContextMenuItem } from './VerticalContextMenuItem';
import { VerticalIcon1 } from '../icon/vertical/VerticalIcon1';
import { VerticalIcon2 } from '../icon/vertical/VerticalIcon2';
import { VerticalIcon3 } from '../icon/vertical/VerticalIcon3';
import { Event } from '../../../../../lib/Event';
import { BaseFont } from '../../../../../canvas/font/BaseFont';

class VerticalContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-vertical-type-context-menu`, PlainUtils.mergeDeep({
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
    Event.bind(this.verticalIcon1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(BaseFont.VERTICAL_ALIGN.top);
      e.stopPropagation();
      e.preventDefault();
    });
    Event.bind(this.verticalIcon2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(BaseFont.VERTICAL_ALIGN.center);
      e.stopPropagation();
      e.preventDefault();
    });
    Event.bind(this.verticalIcon3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(BaseFont.VERTICAL_ALIGN.bottom);
      e.stopPropagation();
      e.preventDefault();
    });
  }
}

export { VerticalContextMenu };
