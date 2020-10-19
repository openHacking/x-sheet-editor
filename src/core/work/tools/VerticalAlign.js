import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { PlainUtils } from '../../../utils/PlainUtils';
import { VerticalContextMenu } from './contextmenu/vertical/VerticalContextMenu';

class VerticalAlign extends DropDownItem {

  constructor(options = {}) {
    super(`${cssPrefix}-tools-vertical-align`);
    this.options = PlainUtils.mergeDeep({ contextMenu: {} }, options);
    this.icon = new Icon('align-middle');
    this.setIcon(this.icon);
    this.verticalContextMenu = new VerticalContextMenu(PlainUtils.copyProp({
      el: this,
    }, this.options.contextMenu));
  }

}

export { VerticalAlign };
