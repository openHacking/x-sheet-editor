import { Element } from './Element';
import { cssPrefix } from '../config';

class Widget extends Element {
  constructor(className = '') {
    super('div', `${cssPrefix}-widget ${className}`);
  }

  computerEventXy(element, event) {
    const { top, left } = element.box();
    return {
      x: event.pageX - left,
      y: event.pageY - top,
    };
  }

  init() {}
}
export { Widget };
