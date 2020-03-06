import { cssPrefix } from '../../../../../config';
import { Icon } from '../../../tools/Icon';
import { h } from '../../../../../lib/Element';
import { ELContextMenuItem } from '../../../../../component/elcontextmenu/ELContextMenuItem';

const pool = [];

class LineTypeContextMenuItem extends ELContextMenuItem {
  constructor(title) {
    super(`${cssPrefix}-font-context-menu-item`);
    this.title = title;
    this.icon = new Icon('checked');
    this.iconElement = h('div', `${cssPrefix}-font-context-menu-item-icon`);
    this.iconElement.children(this.icon);
    this.titleElement = h('div', `${cssPrefix}-font-context-menu-item-title`);
    this.titleElement.text(title);
    this.titleElement.css('font-family', title);
    this.children(this.iconElement);
    this.children(this.titleElement);
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
