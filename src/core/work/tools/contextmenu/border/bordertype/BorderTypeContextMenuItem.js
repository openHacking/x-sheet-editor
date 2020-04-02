import { ELContextMenuItem } from '../../../../../../component/elcontextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../../config';

class BorderTypeContextMenuItem extends ELContextMenuItem {
  constructor() {
    super(`${cssPrefix}-border-type-context-menu-item`);
  }
}

export { BorderTypeContextMenuItem };
