import { ELContextMenuItem } from '../../../../../component/elcontextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../const/Constant';

class TextWrappingContextMenuItem extends ELContextMenuItem {
  constructor() {
    super(`${cssPrefix}-text-wrapping-context-menu-item`);
  }
}

export { TextWrappingContextMenuItem };
