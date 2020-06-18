import { TableDataProxy } from './TableDataProxy';
import { Constant } from '../../../utils/Constant';

class CellDataRecord {
  constructor({ ri, ci, oldCell, newCell }) {
    this.ri = ri;
    this.ci = ci;
    this.oldCell = oldCell;
    this.newCell = newCell;
  }
}

class TableDataSnapshot {

  constructor(table) {
    this.record = false;
    this.backLayerStack = [];
    this.goLayerStack = [];
    this.recordLayer = [];
    this.table = table;
    this.proxy = new TableDataProxy(table, {
      on: {
        setCell: (ri, ci, oldCell, newCell) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new CellDataRecord({ ri, ci, oldCell, newCell }));
        },
      },
    });
  }

  back() {
    const { backLayerStack, goLayerStack, table } = this;
    const { cells } = table;
    const layer = backLayerStack.pop();
    for (let i = 0, len = layer.length; i < len; i += 1) {
      const item = layer[i];
      const { ri, ci, oldCell } = item;
      cells.setCellOrNew(ri, ci, oldCell);
    }
    goLayerStack.push(layer);
    table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    table.render();
  }

  go() {
    const { backLayerStack, goLayerStack, table } = this;
    const { cells } = table;
    const layer = goLayerStack.pop();
    for (let i = 0, len = layer.length; i < len; i += 1) {
      const item = layer[i];
      const { ri, ci, newCell } = item;
      cells.setCellOrNew(ri, ci, newCell);
    }
    backLayerStack.push(layer);
    table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    table.render();
  }

  end() {
    const { table, recordLayer, backLayerStack } = this;
    this.record = false;
    if (recordLayer.length) {
      backLayerStack.push(recordLayer);
    }
    this.recordLayer = [];
    table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
  }

  begin() {
    this.record = true;
  }

  canBack() {
    const { backLayerStack } = this;
    return backLayerStack.length !== 0;
  }

  canGo() {
    const { goLayerStack } = this;
    return goLayerStack.length !== 0;
  }
}

export { TableDataSnapshot };
