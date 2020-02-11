import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';

class Font extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-font`);
    this.setTitle('Arial');
    this.setWidth(50);
    this.setEllipsis();
  }
}
export { Font };
