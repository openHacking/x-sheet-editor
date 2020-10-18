import { ELContextMenu } from '../../../../../component/contextmenu/ELContextMenu';
import { cssPrefix } from '../../../../../const/Constant';
import { PlainUtils } from '../../../../../utils/PlainUtils';

class FontAngleContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-font-color-context-menu`, PlainUtils.mergeDeep({
      onUpdate: () => {},
    }, options));
  }

}

export {
  FontAngleContextMenu,
};
