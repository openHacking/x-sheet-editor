import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';

class ScreenElement extends Widget {
  constructor(className) {
    super(`${cssPrefix}-screen-element ${className}`);
    this.widgets = [];
  }

  addWidgets(widget) {
    this.widgets.push(widget);
    this.children(widget);
  }
}

export { ScreenElement };
