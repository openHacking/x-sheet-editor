import { Element } from './Element';
import { cssPrefix } from '../const/Constant';

class Widget extends Element {

  constructor(className = '', nodeType = "div") {
    super(nodeType, `${cssPrefix}-widget ${className}`);
  }

  computeEventXy(event, element = this) {
    const { top, left } = element.box();
    return {
      x: event.pageX - left,
      y: event.pageY - top,
    };
  }

  computeWidgetXy(element) {
    if (!element) {
      return {
        x: 0,
        y: 0,
      };
    }
    const { top: eleTop, left: eleLeft } = element.box();
    const { top, left } = this.box();
    return {
      x: eleLeft - left,
      y: eleTop - top,
    };
  }

  attach(widget) {
    this.children(widget);
    widget.onAttach(this);
  }

  onAttach() {  }
}

export { Widget };
