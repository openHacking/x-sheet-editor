import { DropDownItem } from '../../../base/DropDownItem';
import { cssPrefix } from '../../../../../../const/Constant';
import { Icon } from '../../../Icon';
import { BorderTypeContextMenu } from '../../border/bordertype/BorderTypeContextMenu';
import { PlainUtils } from '../../../../../../utils/PlainUtils';
import { EL_POPUP_POSITION } from '../../../../../../component/elpopup/ElPopUp';

class Border extends DropDownItem {
  constructor(options) {
    super(`${cssPrefix}-tools-border`);
    this.options = PlainUtils.copyProp({
      contextMenu: {},
    }, options);
    this.icon = new Icon('border');
    this.setIcon(this.icon);
    this.borderTypeContextMenu = new BorderTypeContextMenu(PlainUtils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }
}
export { Border };
