import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';

class ScreenElement extends Widget {
  constructor() {
    super(`${cssPrefix}-screen-element`);
    this.widgets = [];
  }

  addWidgets(widget) {
    this.widgets.push(widget);
    this.children(widget);
  }
}

export { ScreenElement };
