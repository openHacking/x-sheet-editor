import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { PlainUtils } from '../../../utils/PlainUtils';
import { FontContextMenu } from './contextmenu/font/FontContextMenu';

class Font extends DropDownItem {

  constructor(options) {
    super(`${cssPrefix}-tools-font`);
    this.options = PlainUtils.copyProp({
      contextMenu: {},
    }, options);
    this.setTitle('Arial');
    this.setWidth(50);
    this.setEllipsis();
    this.fontContextMenu = new FontContextMenu(PlainUtils.copyProp({
      el: this,
    }, this.options.contextMenu));
  }

}

export { Font };
