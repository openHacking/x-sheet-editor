import { ELContextMenuItem } from '../../../../../../module/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../../const/Constant';

class VerticalContextMenuItem extends ELContextMenuItem {
  constructor() {
    super(`${cssPrefix}-vertical-type-context-menu-item`);
  }
}

export { VerticalContextMenuItem };
