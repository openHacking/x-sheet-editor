import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { FormatContextMenu } from './contextmenu/format/FormatContextMenu';
import { PlainUtils } from '../../../utils/PlainUtils';

class Format extends DropDownItem {

  constructor(options) {
    super(`${cssPrefix}-tools-format`);
    this.options = PlainUtils.copyProp({
      contextMenu: {},
    }, options);
    this.setTitle('常规');
    this.setWidth(50);
    this.setEllipsis();
    this.formatContextMenu = new FormatContextMenu(PlainUtils.copyProp({
      el: this,
    }, this.options.contextMenu));
  }

}

export { Format };
