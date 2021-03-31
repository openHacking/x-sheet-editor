import { ELContextMenuItem } from '../../../../../component/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../const/Constant';
import { h } from '../../../../../libs/Element';

class FileContextMenuItem extends ELContextMenuItem {

  constructor(text) {
    super(`${cssPrefix}-file-context-menu-item`);
    this.scale = text;
    this.titleElement = h('div', `${cssPrefix}-file-context-menu-item-title`);
    this.titleElement.text(`${text}`);
    this.children(this.titleElement);
  }

}

export {
  FileContextMenuItem,
};
