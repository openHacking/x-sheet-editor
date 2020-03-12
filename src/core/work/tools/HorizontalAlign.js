import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { Icon } from './Icon';

class HorizontalAlign extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-horizontal-align`);
    this.icon = new Icon('align-left');
    this.setIcon(this.icon);
  }
}
export { HorizontalAlign };
