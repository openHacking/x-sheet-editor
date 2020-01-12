import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { Icon } from './Icon';

class FontColor extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-font-color`);
    this.drop.hide();
    this.icon = new Icon('color');
    this.icon.css('border-bottom', '3px solid #000000');
    this.setIcon(this.icon);
  }
}

export { FontColor };
