import { ELContextMenuItem } from '../../../component/elcontextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../config';
import { h } from '../../../lib/Element';

class FontContextMenuItem extends ELContextMenuItem {
  constructor(title) {
    super(`${cssPrefix}-font-context-menu-item`);
    this.titleElement = h('div', `${cssPrefix}-font-context-menu-item-title`);
    this.titleElement.text(title);
    this.children(this.titleElement);
  }

  setTitle(title) {
    this.titleElement.text(title);
  }
}

export { FontContextMenuItem };
