import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { HorizontalContextMenu } from './contextmenu/horizontal/HorizontalContextMenu';
import { PlainUtils } from '../../../utils/PlainUtils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';

class HorizontalAlign extends DropDownItem {
  constructor(options = {}) {
    super(`${cssPrefix}-tools-horizontal-align`);
    this.options = PlainUtils.mergeDeep({ contextMenu: {} }, options);
    this.icon = new Icon('align-left');
    this.setIcon(this.icon);
    this.horizontalContextMenu = new HorizontalContextMenu(PlainUtils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }
}
export { HorizontalAlign };
