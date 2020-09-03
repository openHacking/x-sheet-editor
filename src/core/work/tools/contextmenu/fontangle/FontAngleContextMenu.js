import { ELContextMenu } from '../../../../../component/elcontextmenu/ELContextMenu';
import { cssPrefix } from '../../../../../const/Constant';
import { Utils } from '../../../../../utils/Utils';

class FontAngleContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-font-color-context-menu`, Utils.mergeDeep({
      onUpdate: () => {},
    }, options));
  }

}

export {
  FontAngleContextMenu,
};
