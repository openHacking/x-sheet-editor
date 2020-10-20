import { ELContextMenu } from '../../../contextmenu/ELContextMenu';
import { cssPrefix } from '../../../../const/Constant';
import { PlainUtils } from '../../../../utils/PlainUtils';

class SelectContextMenu extends ELContextMenu {

  constructor(options) {
    super(`${cssPrefix}-form-select-menu`, PlainUtils.mergeDeep({
      autoHeight: true,
    }, options));
    this.items = [];
    this.elPopUp.offset({
      width: 200,
    });
  }

  addItem(item) {
    this.items.push(item);
    this.children(item);
  }

}

export {
  SelectContextMenu,
};
