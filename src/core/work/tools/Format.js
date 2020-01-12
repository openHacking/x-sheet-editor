import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';

class Format extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-format`);
    this.setTitle('Normal');
  }
}
export { Format };
