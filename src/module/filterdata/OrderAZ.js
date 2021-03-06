import { ELContextMenuItem } from '../contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../const/Constant';
import { h } from '../../lib/Element';

class OrderAZ extends ELContextMenuItem {

  constructor() {
    super(`${cssPrefix}-filter-data-menu-item ${cssPrefix}-order-az`);
    this.titleElement = h('div', `${cssPrefix}-filter-data-menu-item-title`);
    this.titleElement.text('以A->Z的顺序排序');
    this.childrenNodes(this.titleElement);
  }

}

export {
  OrderAZ,
};
