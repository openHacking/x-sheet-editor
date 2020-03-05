import { ELContextMenu } from '../../../../../component/elcontextmenu/ELContextMenu';
import { cssPrefix } from '../../../../../config';
import { Utils } from '../../../../../utils/Utils';

class BorderTypeContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-border-type-context-menu`, Utils.mergeDeep({
      onUpdate: () => {},
    }, options));
  }
}

export { BorderTypeContextMenu };
