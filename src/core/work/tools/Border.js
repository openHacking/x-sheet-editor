import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { Icon } from './Icon';

class Border extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-border`);
    this.drop.hide();
    this.icon = new Icon('border');
    this.setIcon(this.icon);
  }
}
export { Border };
