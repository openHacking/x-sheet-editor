import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';

class ScreenElement extends Widget {
  constructor(className) {
    super(`${cssPrefix}-screen-element ${className}`);
    this.widgets = [];
  }

  addWidget(widget) {
    this.widgets.push(widget);
    this.children(widget);
  }
}

export { ScreenElement };
