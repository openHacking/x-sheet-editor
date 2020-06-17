import { TableDataProxy } from './TableDataProxy';
import { Constant } from '../../../utils/Constant';

class TableDataSnapshot {

  constructor(table) {
    this.record = false;
    this.backStack = [];
    this.goStack = [];
    this.currentLayer = [];
    this.recordLayer = [];
    this.table = table;
    this.proxy = new TableDataProxy(table, {
      on: {
        setCell: (ri, ci, oldCell, newCell) => {
          if (this.record === false) return;
          this.currentLayer.push({ ri, ci, cell: newCell });
          this.recordLayer.push({ ri, ci, cell: oldCell });
        },
      },
    });
  }

  back() {
    const { backStack, goStack, currentLayer, table } = this;
    const { cells } = table;
    const layer = backStack.pop();
    for (let i = 0, len = layer.length; i < len; i += 1) {
      const item = layer[i];
      const { ri, ci, cell } = item;
      cells.setCellOrNew(ri, ci, cell);
    }
    goStack.push(currentLayer);
    this.currentLayer = layer;
    table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    table.render();
  }

  go() {
    const { backStack, goStack, currentLayer, table } = this;
    const { cells } = table;
    const layer = goStack.pop();
    // console.log('layer>>>', layer);
    for (let i = 0, len = layer.length; i < len; i += 1) {
      const item = layer[i];
      const { ri, ci, cell } = item;
      cells.setCellOrNew(ri, ci, cell);
    }
    backStack.push(currentLayer);
    this.currentLayer = layer;
    table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    table.render();
  }

  end() {
    const { table } = this;
    this.record = false;
    if (this.recordLayer.length > 0) {
      this.backStack.push(this.recordLayer);
      this.goStack = [];
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    }
    this.recordLayer = [];
  }

  begin() {
    this.recordLayer = [];
    this.record = true;
  }

  canBack() {
    const { backStack } = this;
    return backStack.length !== 0;
  }

  canGo() {
    const { goStack } = this;
    return goStack.length !== 0;
  }
}

export { TableDataSnapshot };
