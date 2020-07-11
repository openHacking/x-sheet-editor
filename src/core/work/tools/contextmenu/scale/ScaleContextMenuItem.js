import { ELContextMenuItem } from '../../../../../component/elcontextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../constant/Constant';
import { h } from '../../../../../lib/Element';

class ScaleContextMenuItem extends ELContextMenuItem {

  constructor(scale) {
    super(`${cssPrefix}-scale-context-menu-item`);
    this.scale = scale;
    this.titleElement = h('div', `${cssPrefix}-scale-context-menu-item-title`);
    this.titleElement.text(`${scale}%`);
    this.titleElement.css('text-align', 'center');
    this.children(this.titleElement);
  }

}

export {
  ScaleContextMenuItem,
};