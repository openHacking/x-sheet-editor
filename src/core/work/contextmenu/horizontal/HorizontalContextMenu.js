import { ELContextMenu } from '../../../../component/elcontextmenu/ELContextMenu';
import { cssPrefix } from '../../../../config';
import { Utils } from '../../../../utils/Utils';

class HorizontalContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-horizontal-context-menu`, Utils.mergeDeep({
      onUpdate: () => {},
    }, options));
  }
}

export { HorizontalContextMenu };
