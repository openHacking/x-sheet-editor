import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';

class ELContextMenuItem extends Widget {
  constructor(className = '') {
    super(`${cssPrefix}-el-context-menu-item ${className}`);
  }
}

export { ELContextMenuItem };
