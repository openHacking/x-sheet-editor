import { ELContextMenu } from '../../../../../component/elcontextmenu/ELContextMenu';
import { cssPrefix } from '../../../../../const/Constant';
import { Utils } from '../../../../../utils/Utils';
import { ELContextMenuDivider } from '../../../../../component/elcontextmenu/ELContextMenuDivider';
import { FixedContextMenuItem } from './FixedContextMenuItem';

class FixedContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-fixed-context-menu`, Utils.mergeDeep({
      onUpdate: () => {},
    }, options));
    this.row = new FixedContextMenuItem('冻结至当前行');
    this.row1 = new FixedContextMenuItem('冻结1行');
    this.row2 = new FixedContextMenuItem('冻结2行');
    this.col = new FixedContextMenuItem('冻结至当前列');
    this.col1 = new FixedContextMenuItem('冻结1列');
    this.col2 = new FixedContextMenuItem('冻结2列');
    this.addItem(this.row);
    this.addItem(this.row1);
    this.addItem(this.row2);
    this.addItem(new ELContextMenuDivider());
    this.addItem(this.col);
    this.addItem(this.col1);
    this.addItem(this.col2);
  }

}

export {
  FixedContextMenu,
};
