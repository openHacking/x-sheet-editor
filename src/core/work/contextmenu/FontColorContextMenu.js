import { ELContextMenu } from '../../../component/elcontextmenu/ELContextMenu';
import { cssPrefix } from '../../../config';
import { FontColorContextMenuItem } from './FontColorContextMenuItem';
import { ColorArray } from '../../../component/colorarray/ColorArray';
import { h } from '../../../lib/Element';
import { ColorItem } from '../../../component/colorarray/ColorItem';
import { ELContextMenuDivider } from '../../../component/elcontextmenu/ELContextMenuDivider';
import { Icon } from '../tools/Icon';
import { Utils } from '../../../utils/Utils';

class FontColorContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-font-color-context-menu`, Utils.copyProp({
      onUpdate: () => {},
    }, options));
    // 重置
    this.reset = new FontColorContextMenuItem('重置', new Icon('clear-color'));
    // 颜色筛选
    this.array = new FontColorContextMenuItem();
    this.array.removeClass('hover');
    this.colorArray = new ColorArray({
      selectCb: (item) => {
        const { color } = item.options;
        if (color) this.options.onUpdate(color);
        this.close();
      },
    });
    this.array.children(this.colorArray);
    // 历史选中
    this.title = h('div', `${cssPrefix}-font-color-context-menu-color-title`);
    this.title.text('自定义');
    this.plus = new Icon('plus');
    this.customizeColorArray = new ColorArray({ colors: [
      new ColorItem({ color: 'rgb(0,0,0)' }),
      new ColorItem({ color: 'rgb(67, 67, 67)' }),
      new ColorItem({ color: 'rgb(102, 102, 102)' }),
      new ColorItem({ color: 'rgb(230, 184, 175)' }),
      new ColorItem({ color: 'rgb(244, 204, 204)' }),
      new ColorItem({ color: 'rgb(252, 229, 205)' }),
      new ColorItem({ color: 'rgb(204, 65, 37)' }),
      new ColorItem({ color: 'rgb(224, 102, 102)' }),
      new ColorItem({ color: 'rgb(246, 178, 107)' }),
      new ColorItem({ color: 'rgb(255, 217, 102)' }),
      new ColorItem({ color: 'rgb(147, 196, 125)' }),
      new ColorItem({ color: 'rgb(118, 165, 175)' }),
      new ColorItem({ color: 'rgb(109, 158, 235)' }),
      new ColorItem({ icon: this.plus }),
    ] });
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
}

export { FontColorContextMenu };
