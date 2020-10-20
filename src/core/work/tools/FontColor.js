import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { PlainUtils } from '../../../utils/PlainUtils';
import { FontColorContextMenu } from './contextmenu/fontcolor/FontColorContextMenu';

class FontColor extends DropDownItem {

  constructor(options) {
    super(`${cssPrefix}-tools-font-color`);
    this.options = PlainUtils.mergeDeep({ contextMenu: {} }, options);
    this.icon = new Icon('color');
    this.fontColorContextMenu = new FontColorContextMenu(PlainUtils.copyProp({
      el: this,
    }, this.options.contextMenu));
    this.setIcon(this.icon);
    this.setColor('rgb(0,0,0)');
    this.fontColorContextMenu.setActiveByColor('rgb(0,0,0)');
  }

  setColor(color) {
    this.icon.css('border-bottom', `3px solid ${color}`);
  }

  destroy() {
    super.destroy();
    this.fontColorContextMenu.destroy();
  }

}

export { FontColor };
