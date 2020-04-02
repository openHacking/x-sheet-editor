import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { Icon } from './Icon';
import { Utils } from '../../../utils/Utils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';
import { FontColorContextMenu } from './contextmenu/fontcolor/FontColorContextMenu';

class FontColor extends DropDownItem {
  constructor(options) {
    super(`${cssPrefix}-tools-font-color`);
    this.options = Utils.mergeDeep({ contextMenu: {} }, options);
    this.icon = new Icon('color');
    this.fontColorContextMenu = new FontColorContextMenu(Utils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
    this.setIcon(this.icon);
    this.setColor('rgb(0,0,0)');
    this.fontColorContextMenu.setActiveByColor('rgb(0,0,0)');
  }

  setColor(color) {
    this.icon.css('border-bottom', `3px solid ${color}`);
  }
}

export { FontColor };
