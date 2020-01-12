import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';

class Font extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-font`);
    this.setTitle('Arial');
  }
}
export { Font };
