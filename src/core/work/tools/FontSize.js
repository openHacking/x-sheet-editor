import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';

class FontSize extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-font-size`);
    this.setTitle('10');
    this.setWidth(30);
    this.setEllipsis();
  }
}
export { FontSize };
