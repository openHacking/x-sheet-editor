import { cssPrefix } from '../../config';
import { ContextMenuItem } from './ContextMenuItem';

class ContextMenuDivider extends ContextMenuItem {
  constructor() {
    super(`${cssPrefix}-context-menu-item-divider`);
  }
}

export { ContextMenuDivider };
