import { cssPrefix } from '../../config';
import { ELContextMenuItem } from './ELContextMenuItem';

class ELContextMenuDivider extends ELContextMenuItem {
  constructor() {
    super(`${cssPrefix}-el-context-menu-item-divider`);
  }
}

export { ELContextMenuDivider };
