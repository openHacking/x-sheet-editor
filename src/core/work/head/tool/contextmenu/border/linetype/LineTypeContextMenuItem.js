import { cssPrefix } from '../../../../../../../const/Constant';
import { Icon } from '../../../Icon';
import { h } from '../../../../../../../lib/Element';
import { ELContextMenuItem } from '../../../../../../../module/contextmenu/ELContextMenuItem';

const pool = [];

class LineTypeContextMenuItem extends ELContextMenuItem {
  constructor(type) {
    super(`${cssPrefix}-font-context-menu-item`);
    this.type = type;
    this.icon = new Icon('checked');
    this.typeIcon = new Icon(type);
    this.typeIcon.setWidth(50);
    this.iconElement = h('div', `${cssPrefix}-font-context-menu-item-icon`);
    this.titleElement = h('div', `${cssPrefix}-font-context-menu-item-title`);
    this.iconElement.childrenNodes(this.icon);
    this.titleElement.childrenNodes(this.typeIcon);
    this.childrenNodes(this.iconElement);
    this.childrenNodes(this.titleElement);
    pool.push(this);
  }

  setTitle(title) {
    this.title = title;
    this.titleElement.text(title);
  }

  setActive() {
    pool.forEach((item) => {
      item.removeClass('active');
    });
    this.addClass('active');
  }
}

export { LineTypeContextMenuItem };
