import { ELContextMenu } from '../../../../../../component/elcontextmenu/ELContextMenu';
import { Utils } from '../../../../../../utils/Utils';
import { cssPrefix, Constant } from '../../../../../../const/Constant';
import { LineTypeContextMenuItem } from './LineTypeContextMenuItem';


class LineTypeContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-line-type-context-menu`, Utils.mergeDeep({
      onUpdate: () => {},
    }, options));
    this.items = [
      new LineTypeContextMenuItem('line1'),
      new LineTypeContextMenuItem('line2'),
      new LineTypeContextMenuItem('line3'),
      new LineTypeContextMenuItem('line4'),
      new LineTypeContextMenuItem('line5'),
      new LineTypeContextMenuItem('line6'),
    ];
    this.items.forEach((item) => {
      item.on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
        this.update(item.type);
        item.setActive();
      });
      this.addItem(item);
    });
    this.setActiveByType(this.items[0].type);
  }

  update(type) {
    const { options } = this;
    options.onUpdate(type);
    this.close();
  }

  setActiveByType(type) {
    this.items.forEach((item) => {
      if (item.type === type) {
        item.setActive();
      }
    });
  }
}

export { LineTypeContextMenu };
