import { ELContextMenu } from '../../../../../component/contextmenu/ELContextMenu';
import { cssPrefix, Constant } from '../../../../../const/Constant';
import { FontColorContextMenuItem } from './FontColorContextMenuItem';
import { ColorArray } from '../../../../../component/colorpicker/colorarray/ColorArray';
import { h } from '../../../../../libs/Element';
import { ColorItem } from '../../../../../component/colorpicker/colorarray/ColorItem';
import { ELContextMenuDivider } from '../../../../../component/contextmenu/ELContextMenuDivider';
import { Icon } from '../../Icon';
import { PlainUtils } from '../../../../../utils/PlainUtils';
import { ColorPicker } from '../../../../../component/colorpicker/ColorPicker';
import { XEvent } from '../../../../../libs/XEvent';

class FontColorContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-font-color-context-menu`, PlainUtils.copy({
      onUpdate: () => {},
    }, options));
    this.colorPicker = new ColorPicker({
      selectCb: (color) => {
        this.options.onUpdate(color);
        if (this.addCustomizeColor(color)) {
          this.customizeColorArray.setActiveByColor(color);
        } else {
          this.defaultColorArray.setActiveByColor(color);
        }
        this.close();
      },
    });
    // 重置颜色按钮
    this.resetColorButton = new FontColorContextMenuItem('重置', new Icon('clear-color'));
    // 默认颜色筛选
    this.defaultColorArrayItem = new FontColorContextMenuItem();
    this.defaultColorArrayItem.removeClass('hover');
    this.defaultColorArray = new ColorArray({
      selectCb: (item) => {
        const { color } = item.options;
        if (color) {
          this.options.onUpdate(color);
        }
        this.customizeColorArray.setActiveByColor(null);
        this.close();
      },
    });
    this.defaultColorArrayItem.children(this.defaultColorArray);
    // 自定义颜色
    this.customizeColorArrayItem = new FontColorContextMenuItem();
    this.customizeColorArrayItem.removeClass('hover');
    this.plus = new Icon('plus');
    this.customizeColorArray = new ColorArray({
      colors: [
        new ColorItem({ icon: this.plus }),
      ],
      selectCb: (item) => {
        const { color } = item.options;
        if (color) {
          this.options.onUpdate(color);
          this.defaultColorArray.setActiveByColor(null);
          this.close();
        } else {
          const activeColor = this.customizeColorArray.activeColor
            || this.defaultColorArray.activeColor;
          this.colorPicker.open(activeColor);
        }
      },
    });
    this.customizeColorTitle = h('div', `${cssPrefix}-font-color-context-menu-color-title`);
    this.customizeColorTitle.text('自定义');
    this.customizeColorArrayItem.children(this.customizeColorTitle);
    this.customizeColorArrayItem.children(this.customizeColorArray);
    // 菜单元素追加子节点
    this.addItem(this.resetColorButton);
    this.addItem(this.defaultColorArrayItem);
    this.addItem(new ELContextMenuDivider());
    this.addItem(this.customizeColorArrayItem);
    this.bind();
  }

  unbind() {
    XEvent.unbind(this.resetColorButton);
  }

  bind() {
    XEvent.bind(this.resetColorButton, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.options.onUpdate('rgb(0,0,0)');
      this.customizeColorArray.setActiveByColor(null);
      this.defaultColorArray.setActiveByColor(null);
    });
  }

  setActiveByColor(color) {
    this.customizeColorArray.setActiveByColor(color);
    this.defaultColorArray.setActiveByColor(color);
  }

  clearCustomizeColor() {
    this.customizeColorArray.clear();
    this.customizeColorArray.add(new ColorItem({ icon: this.plus }));
  }

  addCustomizeColor(color) {
    const result = this.defaultColorArray.findItemByColor(color);
    if (!result) {
      this.customizeColorArray.add(new ColorItem({ color }));
      return true;
    }
    return false;
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { FontColorContextMenu };
