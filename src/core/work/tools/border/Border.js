import { DropDownItem } from '../base/DropDownItem';
import { cssPrefix } from '../../../../config';
import { Icon } from '../Icon';
import { BorderTypeContextMenu } from '../../contextmenu/border/bordertype/BorderTypeContextMenu';
import { Utils } from '../../../../utils/Utils';
import { EL_POPUP_POSITION } from '../../../../component/elpopup/ElPopUp';

class Border extends DropDownItem {
  constructor(options) {
    super(`${cssPrefix}-tools-border`);
    this.options = Utils.copyProp({
      contextMenu: {},
    }, options);
    this.icon = new Icon('border');
    this.setIcon(this.icon);
    this.borderTypeContextMenu = new BorderTypeContextMenu(Utils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }
}
export { Border };
