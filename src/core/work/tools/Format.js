import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { FormatContextMenu } from '../contextmenu/format/FormatContextMenu';

class Format extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-format`);
    this.setTitle('Normal');
    this.formatContextMenu = new FormatContextMenu();
  }
}
export { Format };
