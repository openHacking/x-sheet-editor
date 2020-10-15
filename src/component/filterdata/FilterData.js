import { cssPrefix } from '../../const/Constant';
import { ELContextMenu } from '../elcontextmenu/ELContextMenu';

class FilterData extends ELContextMenu {

  constructor(options) {
    super(`${cssPrefix}-filter-data`, options);
  }

}

export {
  FilterData,
};
