import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../const/Constant';
import { XTableDimensions } from '../table/XTableDimensions,';

class Sheet extends Widget {

  constructor(options = {
    tableConfig: {
      data: [],
    },
  }) {
    super(`${cssPrefix}-sheet`);
    this.options = options;
    this.table = new XTableDimensions({
      settings: this.options.tableConfig,
    });
  }

  onAttach() {
    const { table } = this;
    this.attach(table);
  }

}

export { Sheet };
