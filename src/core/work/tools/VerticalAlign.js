import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { PlainUtils } from '../../../utils/PlainUtils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';
import { VerticalContextMenu } from './contextmenu/vertical/VerticalContextMenu';

class VerticalAlign extends DropDownItem {
  constructor(options = {}) {
    super(`${cssPrefix}-tools-vertical-align`);
    this.options = PlainUtils.mergeDeep({ contextMenu: {} }, options);
    this.icon = new Icon('align-middle');
    this.setIcon(this.icon);
    this.verticalContextMenu = new VerticalContextMenu(PlainUtils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }
}

export { VerticalAlign };
