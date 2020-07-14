import { ELContextMenuItem } from '../../../../../../component/elcontextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../../const/Constant';

class BorderTypeContextMenuItem extends ELContextMenuItem {
  constructor() {
    super(`${cssPrefix}-border-type-context-menu-item`);
  }
}

export { BorderTypeContextMenuItem };
