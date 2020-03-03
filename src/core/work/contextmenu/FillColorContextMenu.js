import { ELContextMenu } from '../../../component/elcontextmenu/ELContextMenu';
import { cssPrefix } from '../../../config';
import { FontColorContextMenuItem } from './FontColorContextMenuItem';
import { ColorArray } from '../../../component/colorarray/ColorArray';
import { h } from '../../../lib/Element';
import { ColorItem } from '../../../component/colorarray/ColorItem';
import { ELContextMenuDivider } from '../../../component/elcontextmenu/ELContextMenuDivider';
import { Icon } from '../tools/Icon';
import { Utils } from '../../../utils/Utils';
import { Constant } from '../../../utils/Constant';

class FillColorContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-fill-color-context-menu`, Utils.copyProp({
      onUpdate: () => {},
    }, options));
    // 重置
    this.reset = new FontColorContextMenuItem('重置', new Icon('clear-color'));
    this.reset.on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.options.onUpdate(null);
      this.customizeColorArray.setActiveByColor(null);
      this.colorArray.setActiveByColor(null);
    });
    // 颜色筛选
    this.array = new FontColorContextMenuItem();
    this.array.removeClass('hover');
    this.colorArray = new ColorArray({
      selectCb: (item) => {
        const { color } = item.options;
        if (color) this.options.onUpdate(color);
        this.customizeColorArray.setActiveByColor(null);
        this.close();
      },
    });
    this.array.children(this.colorArray);
    // 历史选中
    this.title = h('div', `${cssPrefix}-fill-color-context-menu-color-title`);
    this.title.text('自定义');
    this.plus = new Icon('plus');
    this.customizeColorArray = new ColorArray({
      colors: [
        new ColorItem({ icon: this.plus }),
      ],
      selectCb: (item) => {
        const { color } = item.options;
        if (color) {
          this.options.onUpdate(color);
          this.colorArray.setActiveByColor(null);
          this.close();
        } else {
          // TODO ...
          // 打开颜色筛选 ....
        }
      },
    });
    this.customize = new FontColorContextMenuItem();
    this.customize.removeClass('hover');
    this.customize.children(this.title);
    this.customize.children(this.customizeColorArray);
    // 菜单元素追加子节点
    this.children(this.reset);
    this.children(this.array);
    this.children(new ELContextMenuDivider());
    this.children(this.customize);
  }

  setActiveByColor(color) {
    this.customizeColorArray.setActiveByColor(color);
    this.colorArray.setActiveByColor(color);
  }
}

export { FillColorContextMenu };
