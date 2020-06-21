import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../constant/Constant';

class ELContextMenuItem extends Widget {
  constructor(className = '') {
    super(`${cssPrefix}-el-context-menu-item hover ${className}`);
  }
}

export { ELContextMenuItem };
