import { ELContextMenuItem } from '../../../../../../module/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../../const/Constant';
import { h } from '../../../../../../lib/Element';

class ScaleContextMenuItem extends ELContextMenuItem {

  constructor(scale) {
    super(`${cssPrefix}-scale-context-menu-item`);
    this.scale = scale;
    this.titleElement = h('div', `${cssPrefix}-scale-context-menu-item-title`);
    this.titleElement.text(`${scale}%`);
    this.childrenNodes(this.titleElement);
  }

}

export {
  ScaleContextMenuItem,
};
