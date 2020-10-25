import { ELContextMenu } from '../contextmenu/ELContextMenu';
import { Constant, cssPrefix } from '../../const/Constant';
import { AutoFillTypeMenuItem } from './AutoFillTypeMenuItem';
import { XEvent } from '../../lib/XEvent';
import { AutoFillType } from './AutoFillType';

class AutoFillTypeMenu extends ELContextMenu {

  constructor(options = {
    onUpdate: () => {},
  }) {
    super(`${cssPrefix}-auto-fill-menu`, options);
    this.addItem(new AutoFillTypeMenuItem({ text: '以序列化的方式填充', value: AutoFillType.FILL_TYPE.SERIALIZE }));
    this.addItem(new AutoFillTypeMenuItem({ text: '填充单元格内容', value: AutoFillType.FILL_TYPE.FILLING }));
    this.bind();
  }

  unbind() {
    this.menus.forEach((menu) => {
      XEvent.unbind(menu);
    });
  }

  bind() {
    this.menus.forEach((menu) => {
      XEvent.bind(menu, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
        this.options.onUpdate(menu);
      });
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  AutoFillTypeMenu,
};
