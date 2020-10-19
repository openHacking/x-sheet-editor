import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { HorizontalContextMenu } from './contextmenu/horizontal/HorizontalContextMenu';
import { PlainUtils } from '../../../utils/PlainUtils';

class HorizontalAlign extends DropDownItem {

  constructor(options = {}) {
    super(`${cssPrefix}-tools-horizontal-align`);
    this.options = PlainUtils.mergeDeep({ contextMenu: {} }, options);
    this.icon = new Icon('align-left');
    this.setIcon(this.icon);
    this.horizontalContextMenu = new HorizontalContextMenu(PlainUtils.copyProp({
      el: this,
    }, this.options.contextMenu));
  }

}
export { HorizontalAlign };
