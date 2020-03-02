import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { Icon } from './Icon';
import { Utils } from '../../../utils/Utils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';
import { FontColorContextMenu } from '../contextmenu/FontColorContextMenu';

class FontColor extends DropDownItem {
  constructor(options) {
    super(`${cssPrefix}-tools-font-color`);
    this.options = Utils.mergeDeep({ contextMenu: {} }, options);
    this.drop.hide();
    this.icon = new Icon('color');
    this.icon.css('border-bottom', '3px solid #000000');
    this.fontColorContextMenu = new FontColorContextMenu(Utils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
    this.setIcon(this.icon);
  }
}

export { FontColor };
