import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { PlainUtils } from '../../../utils/PlainUtils';
import { Icon } from './Icon';
import { FontAngleContextMenu } from './contextmenu/fontangle/FontAngleContextMenu';

class FontAngle extends DropDownItem {

  constructor(options) {
    super(`${cssPrefix}-tools-angle`);
    this.options = PlainUtils.copyProp({
      contextMenu: {},
    }, options);
    this.icon = new Icon('angle');
    this.setIcon(this.icon);
    this.fontAngleContextMenu = new FontAngleContextMenu({
      el: this,
    });
  }

}
export {
  FontAngle,
};
