import { cssPrefix } from '../../../config';
import { Icon } from './Icon';
import { Item } from './base/Item';

class TextWrapping extends Item {
  constructor() {
    super(`${cssPrefix}-tools-text-wrapping`);
    this.icon = new Icon('text-wrap');
    this.children(this.icon);
  }
}
export { TextWrapping };
