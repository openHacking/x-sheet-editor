import { ELContextMenuItem } from '../../../../../component/elcontextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../constant/Constant';

class TextWrappingContextMenuItem extends ELContextMenuItem {
  constructor() {
    super(`${cssPrefix}-text-wrapping-context-menu-item`);
  }
}

export { TextWrappingContextMenuItem };
