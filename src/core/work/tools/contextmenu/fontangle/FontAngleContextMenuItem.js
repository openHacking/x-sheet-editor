import { ELContextMenuItem } from '../../../../../component/elcontextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../const/Constant';
import { h } from '../../../../../lib/Element';

class FontAngleContextMenuItem extends ELContextMenuItem {

  constructor(title, icon) {
    super(`${cssPrefix}-font-angle-context-menu-item`);
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

export {
  FontAngleContextMenuItem,
};
