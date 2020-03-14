import { ELContextMenuItem } from '../../../../component/elcontextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../config';

class HorizontalContextMenuItem extends ELContextMenuItem {
  constructor() {
    super(`${cssPrefix}-horizontal-context-menu-item`);
  }
}

export { HorizontalContextMenuItem };
