import { ELContextMenu } from '../../../../../component/elcontextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../../../../const/Constant';
import { PlainUtils } from '../../../../../utils/PlainUtils';
import { ScaleContextMenuItem } from './ScaleContextMenuItem';

class ScaleContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-scale-context-menu`, PlainUtils.mergeDeep({
      onUpdate: () => {},
    }, options));
    this.items = [
      new ScaleContextMenuItem(200),
      new ScaleContextMenuItem(150),
      new ScaleContextMenuItem(125),
      new ScaleContextMenuItem(100),
      new ScaleContextMenuItem(90),
      new ScaleContextMenuItem(75),
      new ScaleContextMenuItem(50),
    ];
    this.items.forEach((item) => {
      item.on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
        this.update(item.scale);
      });
      this.addItem(item);
    });
  }

  update(scale) {
    const { options } = this;
    options.onUpdate(scale);
    this.close();
  }

}

export {
  ScaleContextMenu,
};
