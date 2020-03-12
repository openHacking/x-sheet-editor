import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { Icon } from './Icon';

class VerticalAlign extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-vertical-align`);
    this.icon = new Icon('align-middle');
    this.setIcon(this.icon);
  }
}
export { VerticalAlign };
