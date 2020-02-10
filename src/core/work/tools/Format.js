import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { FormatContextMenu } from '../contextmenu/FormatContextMenu';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';

class Format extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-format`);
    this.setTitle('Normal');
    this.formatContextMenu = new FormatContextMenu({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    });
  }
}

export { Format };
