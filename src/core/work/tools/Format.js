import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { FormatContextMenu } from './contextmenu/format/FormatContextMenu';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';
import { Utils } from '../../../utils/Utils';

class Format extends DropDownItem {
  constructor(options) {
    super(`${cssPrefix}-tools-format`);
    this.options = Utils.copyProp({
      contextMenu: {},
    }, options);
    this.setTitle('常规');
    this.setWidth(50);
    this.setEllipsis();
    this.formatContextMenu = new FormatContextMenu(Utils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }
}

export { Format };
