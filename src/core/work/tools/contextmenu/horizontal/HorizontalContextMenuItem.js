import { ELContextMenuItem } from '../../../../../component/elcontextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../const/Constant';

class HorizontalContextMenuItem extends ELContextMenuItem {
  constructor() {
    super(`${cssPrefix}-horizontal-type-context-menu-item`);
  }
}

export { HorizontalContextMenuItem };
