import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { Icon } from './Icon';

class Functions extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-format`);
    this.icon = new Icon('functions');
    this.setIcon(this.icon);
  }
}
export { Functions };
