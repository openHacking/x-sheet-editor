import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../config';
import { FormatContextMenu } from '../contextmenu/format/FormatContextMenu';
import { ElLocation, LOCATION_TYPE } from '../../../component/popup/ElLocation';

class Format extends DropDownItem {
  constructor() {
    super(`${cssPrefix}-tools-format`);
    this.setTitle('Normal');
    this.formatContextMenu = new FormatContextMenu({
      location: new ElLocation(this, LOCATION_TYPE.BOTTOM),
    });
  }
}

export { Format };
