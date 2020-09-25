import { ELContextMenu } from '../../../../../component/elcontextmenu/ELContextMenu';
import { ELContextMenuDivider } from '../../../../../component/elcontextmenu/ELContextMenuDivider';
import { FixedContextMenuItem } from './FixedContextMenuItem';
import { Constant, cssPrefix } from '../../../../../const/Constant';
import { Utils } from '../../../../../utils/Utils';
import { EventBind } from '../../../../../utils/EventBind';

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
    EventBind.bind(this.row, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      const { options } = this;
      options.onUpdate('ROW');
      this.close();
    });
    EventBind.bind(this.row1, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      const { options } = this;
      options.onUpdate('ROW1');
      this.close();
    });
    EventBind.bind(this.row2, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      const { options } = this;
      options.onUpdate('ROW2');
      this.close();
    });
    EventBind.bind(this.col, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      const { options } = this;
      options.onUpdate('COL');
      this.close();
    });
    EventBind.bind(this.col1, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      const { options } = this;
      options.onUpdate('COL1');
      this.close();
    });
    EventBind.bind(this.col2, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      const { options } = this;
      options.onUpdate('COL2');
      this.close();
    });
  }

}

export {
  FixedContextMenu,
};