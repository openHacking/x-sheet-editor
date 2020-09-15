import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { DropDownItem } from './base/DropDownItem';
import { FixedContextMenu } from './contextmenu/fixed/FixedContextMenu';
import { Utils } from '../../../utils/Utils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';

class Fixed extends DropDownItem {

  constructor(options) {
    super(`${cssPrefix}-tools-fixed`);
    this.options = Utils.copyProp({
      contextMenu: {},
    }, options);
    this.icon = new Icon('freeze');
    this.setIcon(this.icon);
    this.fixedContextMenu = new FixedContextMenu(Utils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }

}

export { Fixed };
