import { ELContextMenu } from '../../../../../../component/elcontextmenu/ELContextMenu';
import { cssPrefix } from '../../../../../../config';
import { Utils } from '../../../../../../utils/Utils';
import { ColorPicker } from '../../../../../../component/colorpicker/ColorPicker';
import { ColorItem } from '../../../../../../component/colorarray/ColorItem';
import { Icon } from '../../../Icon';
import { Constant } from '../../../../../constant/Constant';
import { ColorArray } from '../../../../../../component/colorarray/ColorArray';
import { ELContextMenuDivider } from '../../../../../../component/elcontextmenu/ELContextMenuDivider';
import { BorderColorContextMenuItem } from './BorderColorContextMenuItem';
import { h } from '../../../../../../lib/Element';

class BorderColorContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-border-color-context-menu`, Utils.mergeDeep({
      onUpdate: () => {},
    }, options));
    this.colorPicker = new ColorPicker({
      selectCb: (color) => {
        const item = new ColorItem({ color });
        this.customizeColorArray.add(item);
        this.customizeColorArray.setActiveByColor(color);
        this.colorArray.setActiveByColor(null);
        this.options.onUpdate(color);
        this.close();
      },
    });
    // 重置
    this.reset = new BorderColorContextMenuItem('重置', new Icon('clear-color'));
    this.reset.on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.options.onUpdate('rgb(0,0,0)');
      this.customizeColorArray.setActiveByColor(null);
      this.colorArray.setActiveByColor(null);
    });
    // 颜色筛选
    this.array = new BorderColorContextMenuItem();
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
    this.title = h('div', `${cssPrefix}-border-color-context-menu-color-title`);
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
          this.colorPicker.open(this.customizeColorArray.activeColor);
        }
      },
    });
    this.customize = new BorderColorContextMenuItem();
    this.customize.removeClass('hover');
    this.customize.children(this.title);
    this.customize.children(this.customizeColorArray);
    // 菜单元素追加子节点
    this.addItem(this.reset);
    this.addItem(this.array);
    this.addItem(new ELContextMenuDivider());
    this.addItem(this.customize);
  }

  setActiveByColor(color) {
    this.customizeColorArray.setActiveByColor(color);
    this.colorArray.setActiveByColor(color);
  }
}

export { BorderColorContextMenu };
