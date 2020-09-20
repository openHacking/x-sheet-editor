import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { DropDownItem } from './base/DropDownItem';
import { FixedContextMenu } from './contextmenu/fixed/FixedContextMenu';
import { Utils } from '../../../utils/Utils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';

class Fixed extends DropDownItem {

  constructor(options) {
    super(`${cssPrefix}-tools-fixed`);
    this.options = Utils.copyProp({
      contextMenu: {},
    }, options);
    this.icon = new Icon('freeze');
    this.rowStatus = false;
    this.colStatus = false;
    this.setIcon(this.icon);
    this.fixedContextMenu = new FixedContextMenu(Utils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }

  setFixedColStatus(status) {
    const { fixedContextMenu } = this;
    if (status) {
      this.colStatus = true;
      fixedContextMenu.col.setTitle('取消冻结列');
    } else {
      this.colStatus = false;
      fixedContextMenu.col.setTitle('冻结至当前列');
    }
  }

  setFixedRowStatus(status) {
    const { fixedContextMenu } = this;
    if (status) {
      this.rowStatus = true;
      fixedContextMenu.row.setTitle('取消冻结行');
    } else {
      this.rowStatus = false;
      fixedContextMenu.row.setTitle('冻结至当前行');
    }
  }

}

export { Fixed };
