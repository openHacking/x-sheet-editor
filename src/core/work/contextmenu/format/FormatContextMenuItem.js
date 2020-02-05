import { ContextMenuItem } from '../../../../component/contextmenu/ContextMenuItem';
import { h } from '../../../../lib/Element';
import { cssPrefix } from '../../../../config';

class FormatContextMenuItem extends ContextMenuItem {
  constructor(title, desc) {
    super(`${cssPrefix}-format-context-menu-item`);
    this.titleElement = h('div', 'format-context-menu-item-title');
    this.descElement = h('div', 'format-context-menu-item-desc');
    this.titleElement.text(title);
    this.descElement.text(desc);
    this.children(this.titleElement);
    this.children(this.descElement);
  }

  setTitle(title) {
    this.titleElement.text(title);
  }

  setDesc(desc) {
    this.descElement.text(desc);
  }
}

export { FormatContextMenuItem };
