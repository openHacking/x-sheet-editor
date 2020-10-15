import { ELContextMenuItem } from '../elcontextmenu/ELContextMenuItem';
import { cssPrefix } from '../../const/Constant';

class ValueFilter extends ELContextMenuItem {

  constructor() {
    super(`${cssPrefix}-value-filter`);
  }

}

export {
  ValueFilter,
};
