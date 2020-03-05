import { ELContextMenuItem } from '../../../../component/elcontextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../config';
import { h } from '../../../../lib/Element';

class FontSizeContextMenuItem extends ELContextMenuItem {
  constructor(size) {
    super(`${cssPrefix}-font-size-context-menu-item`);
    this.size = size;
    this.titleElement = h('div', `${cssPrefix}-font-size-context-menu-item-title`);
    this.titleElement.text(size);
    this.titleElement.css('text-align', 'center');
    this.children(this.titleElement);
  }
}

export { FontSizeContextMenuItem };
