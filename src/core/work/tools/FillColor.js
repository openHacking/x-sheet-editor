import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { Utils } from '../../../utils/Utils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';
import { FillColorContextMenu } from './contextmenu/fillcolor/FillColorContextMenu';

class FillColor extends DropDownItem {
  constructor(options) {
    super(`${cssPrefix}-tools-fill-color`);
    this.options = Utils.mergeDeep({ contextMenu: {} }, options);
    this.icon = new Icon('fill-color');
    this.fillColorContextMenu = new FillColorContextMenu(Utils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
    this.setIcon(this.icon);
    this.setColor('rgb(255, 255, 255)');
    this.fillColorContextMenu.setActiveByColor('rgb(255, 255, 255)');
  }

  setColor(color) {
    this.icon.css('border-bottom', `3px solid ${color}`);
  }
}

export { FillColor };
