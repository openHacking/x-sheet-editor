import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { FormatContextMenu } from '../contextmenu/FormatContextMenu';
import { Utils } from '../../../utils/Utils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';
import { FontContextMenu } from '../contextmenu/FontContextMenu';

class Font extends DropDownItem {
  constructor(options) {
    super(`${cssPrefix}-tools-font`);
    this.options = Utils.copyProp({
      contextMenu: {},
    }, options);
    this.setTitle('Arial');
    this.setWidth(50);
    this.setEllipsis();
    this.fontContextMenu = new FontContextMenu(Utils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }
}
export { Font };
