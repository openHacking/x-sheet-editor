import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { FontSizeContextMenu } from './contextmenu/fontsize/FontSizeContextMenu';
import { PlainUtils } from '../../../utils/PlainUtils';

class FontSize extends DropDownItem {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-font-size`);
    this.options = options;
    this.setTitle('10');
    this.setWidth(30);
    this.setEllipsis();
    this.fontSizeContextMenu = new FontSizeContextMenu(PlainUtils.copyProp({
      el: this,
    }, this.options.contextMenu));
  }

}

export { FontSize };
