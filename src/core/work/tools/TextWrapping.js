import { cssPrefix } from '../../../const/Constant';
import { Icon } from './Icon';
import { PlainUtils } from '../../../utils/PlainUtils';
import { EL_POPUP_POSITION } from '../../../component/elpopup/ElPopUp';
import { DropDownItem } from './base/DropDownItem';
import { TextWrappingContextMenu } from './contextmenu/textwrapping/TextWrappingContextMenu';

class TextWrapping extends DropDownItem {
  constructor(options = {}) {
    super(`${cssPrefix}-tools-text-wrapping`);
    this.options = PlainUtils.mergeDeep({ contextMenu: {} }, options);
    this.icon = new Icon('text-wrap');
    this.setIcon(this.icon);
    this.textWrappingContextMenu = new TextWrappingContextMenu(PlainUtils.copyProp({
      el: this,
      position: EL_POPUP_POSITION.BOTTOM,
    }, this.options.contextMenu));
  }
}

export { TextWrapping };
