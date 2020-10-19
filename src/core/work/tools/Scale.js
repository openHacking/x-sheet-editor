import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { PlainUtils } from '../../../utils/PlainUtils';
import { ScaleContextMenu } from './contextmenu/scale/ScaleContextMenu';

class Scale extends DropDownItem {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-scale`);
    this.options = options;
    this.setTitle('100%');
    this.setWidth(50);
    this.setEllipsis();
    this.scaleContextMenu = new ScaleContextMenu(PlainUtils.copyProp({
      el: this,
    }, this.options.contextMenu));
  }

}

export {
  Scale,
};
