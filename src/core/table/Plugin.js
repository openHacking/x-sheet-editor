import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';

class Plugin extends Widget {
  constructor(className) {
    super(`${cssPrefix}-table-plugin ${className}`);
  }

  ready(table) { return table; }
}

export { Plugin };
