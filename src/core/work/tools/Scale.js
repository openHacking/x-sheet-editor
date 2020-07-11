import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../constant/Constant';
import { Utils } from '../../../utils/Utils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';
import { ScaleContextMenu } from './contextmenu/scale/ScaleContextMenu';

class Scale extends DropDownItem {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-scale`);
    this.options = options;
    this.setTitle('100%');
    this.setWidth(50);
    this.setEllipsis();
    this.scaleContextMenu = new ScaleContextMenu(Utils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }

}

export {
  Scale,
};
