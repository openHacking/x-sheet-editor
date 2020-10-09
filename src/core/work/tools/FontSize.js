import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { FontSizeContextMenu } from './contextmenu/fontsize/FontSizeContextMenu';
import { PlainUtils } from '../../../utils/PlainUtils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';

class FontSize extends DropDownItem {
  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-font-size`);
    this.options = options;
    this.setTitle('10');
    this.setWidth(30);
    this.setEllipsis();
    this.fontSizeContextMenu = new FontSizeContextMenu(PlainUtils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }
}

export { FontSize };
