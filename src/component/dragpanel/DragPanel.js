import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';

class DragPanel extends Widget {
  constructor() {
    super(`${cssPrefix}-drag-panel`);
  }
}

export { DragPanel };
