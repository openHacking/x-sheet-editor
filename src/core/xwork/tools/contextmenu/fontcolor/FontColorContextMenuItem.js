import { ELContextMenuItem } from '../../../../../component/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../const/Constant';
import { h } from '../../../../../libs/Element';

class FontColorContextMenuItem extends ELContextMenuItem {

  constructor(title, icon) {
    super(`${cssPrefix}-font-color-context-menu-item`);
    this.title = title;
    this.icon = icon;
    if (icon) {
      this.iconElement = h('div', `${cssPrefix}-font-color-context-menu-item-icon`);
      this.iconElement.children(this.icon);
      this.children(this.iconElement);
    }
    if (title) {
      this.titleElement = h('div', `${cssPrefix}-font-color-context-menu-item-title`);
      this.titleElement.text(title);
      this.children(this.titleElement);
    }
  }

}

export { FontColorContextMenuItem };
