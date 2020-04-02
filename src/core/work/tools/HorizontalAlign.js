import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { Icon } from './Icon';
import { HorizontalContextMenu } from './contextmenu/horizontal/HorizontalContextMenu';
import { Utils } from '../../../utils/Utils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';

class HorizontalAlign extends DropDownItem {
  constructor(options = {}) {
    super(`${cssPrefix}-tools-horizontal-align`);
    this.options = Utils.mergeDeep({ contextMenu: {} }, options);
    this.icon = new Icon('align-left');
    this.setIcon(this.icon);
    this.horizontalContextMenu = new HorizontalContextMenu(Utils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }
}
export { HorizontalAlign };
