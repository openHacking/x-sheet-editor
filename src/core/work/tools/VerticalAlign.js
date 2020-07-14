import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { Utils } from '../../../utils/Utils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';
import { VerticalContextMenu } from './contextmenu/vertical/VerticalContextMenu';

class VerticalAlign extends DropDownItem {
  constructor(options = {}) {
    super(`${cssPrefix}-tools-vertical-align`);
    this.options = Utils.mergeDeep({ contextMenu: {} }, options);
    this.icon = new Icon('align-middle');
    this.setIcon(this.icon);
    this.verticalContextMenu = new VerticalContextMenu(Utils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }
}

export { VerticalAlign };
