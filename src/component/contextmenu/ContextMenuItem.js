import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';

class ContextMenuItem extends Widget {
  constructor(className = '') {
    super(`${cssPrefix}-context-menu-item ${className}`);
  }
}

export { ContextMenuItem };
