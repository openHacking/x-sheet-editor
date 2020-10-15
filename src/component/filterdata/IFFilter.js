import { ELContextMenuItem } from '../elcontextmenu/ELContextMenuItem';
import { cssPrefix } from '../../const/Constant';

class IFFilter extends ELContextMenuItem {

  constructor() {
    super(`${cssPrefix}-if-filter`);
  }

}

export {
  IFFilter,
};
