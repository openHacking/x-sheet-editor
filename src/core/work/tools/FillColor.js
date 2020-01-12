import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { Icon } from './Icon';

class FillColor extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-fill-color`);
    this.drop.hide();
    this.icon = new Icon('fill-color');
    this.icon.css('border-bottom', '3px solid #000000');
    this.setIcon(this.icon);
  }
}

export { FillColor };
