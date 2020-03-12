import { History } from './History';
import { Utils } from '../../utils/Utils';
import { Constant } from '../../utils/Constant';

class DataSnapshot {

  constructor(table) {
    this.table = table;
    const { cells, merges } = table;
    this.undo = new History({
      onPop: (e) => {
        this.redo.add(Utils.cloneDeep(e));
        const top = this.undo.get();
        cells.setData(Utils.cloneDeep(top.cells));
        merges.setData(Utils.cloneDeep(top.merges));
        table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
        table.render();
      },
    });
    this.redo = new History({
      onPop: (e) => {
        this.undo.add(Utils.cloneDeep(e));
        const top = this.undo.get();
        cells.setData(Utils.cloneDeep(top.cells));
        merges.setData(Utils.cloneDeep(top.merges));
        table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
        table.render();
      },
    });
    this.undo.add({
      cells: Utils.cloneDeep(cells.getData()),
      merges: Utils.cloneDeep(merges.getData()),
    });
  }

  snapshot(clear = false) {
    const { table } = this;
    const { cells, merges } = table;
    if (clear) {
      this.redo.clear();
    }
    this.undo.add({
      cells: Utils.cloneDeep(cells.getData()),
      merges: Utils.cloneDeep(merges.getData()),
    });
    table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
  }
}

export { DataSnapshot };
