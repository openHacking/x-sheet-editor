import { cssPrefix } from '../../../config';
import { Icon } from './Icon';
import { Utils } from '../../../utils/Utils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';
import { DropDownItem } from './base/DropDownItem';
import { TextWrappingContextMenu } from '../contextmenu/textwrapping/TextWrappingContextMenu';

class TextWrapping extends DropDownItem {
  constructor(options = {}) {
    super(`${cssPrefix}-tools-text-wrapping`);
    this.options = Utils.mergeDeep({ contextMenu: {} }, options);
    this.icon = new Icon('text-wrap');
    this.setIcon(this.icon);
    this.textWrappingContextMenu = new TextWrappingContextMenu(Utils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }
}

export { TextWrapping };
