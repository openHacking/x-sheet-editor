import { ToggleItem } from './ToggleItem';
import { cssPrefix } from '../../config';
import { Icon } from './Icon';

class Undo extends ToggleItem {
  constructor() {
    super(`${cssPrefix}-tools-undo`);
    this.icon = new Icon('undo');
    this.children(this.icon);
  }
}

export { Undo };
