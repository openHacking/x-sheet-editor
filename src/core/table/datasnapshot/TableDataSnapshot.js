import { Constant } from '../../../utils/Constant';
import { TableCellDataProxy } from './proxy/TableCellDataProxy';
import { CellDataRecord } from './record/CellDataRecord';
import { MERGE_RECORD_TYPE, MergeDataRecord } from './record/MergeDataRecord';
import { TableMergeDataProxy } from './proxy/TableMergeDataProxy';

class TableDataSnapshot {

  constructor(table) {
    this.record = false;
    this.backLayerStack = [];
    this.goLayerStack = [];
    this.recordLayer = [];
    this.table = table;
    this.mergeDataProxy = new TableMergeDataProxy(table, {
      on: {
        addMerge: (merge) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new MergeDataRecord({ merge, recordType: MERGE_RECORD_TYPE.ADD }));
        },
        deleteMerge: (merge) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new MergeDataRecord({ merge, recordType: MERGE_RECORD_TYPE.DELETE }));
        },
      },
    });
    this.cellDataProxy = new TableCellDataProxy(table, {
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
    const { cells, merges } = table;
    const layer = backLayerStack.pop();
    for (let i = 0, len = layer.length; i < len; i += 1) {
      const item = layer[i];
      // 单元格元素
      if (item instanceof CellDataRecord) {
        const { ri, ci, oldCell } = item;
        cells.setCellOrNew(ri, ci, oldCell);
        continue;
      }
      // 合并单元格元素
      if (item instanceof MergeDataRecord) {
        const { merge, recordType } = item;
        switch (recordType) {
          case MERGE_RECORD_TYPE.ADD:
            merges.deleteIntersects(merge);
            break;
          case MERGE_RECORD_TYPE.DELETE:
            merges.add(merge);
            break;
          default: break;
        }
      }
    }
    goLayerStack.push(layer);
    table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    table.render();
  }

  go() {
    const { backLayerStack, goLayerStack, table } = this;
    const { cells, merges } = table;
    const layer = goLayerStack.pop();
    for (let i = 0, len = layer.length; i < len; i += 1) {
      const item = layer[i];
      // 单元格元素
      if (item instanceof CellDataRecord) {
        const { ri, ci, newCell } = item;
        cells.setCellOrNew(ri, ci, newCell);
        continue;
      }
      // 合并单元格元素
      if (item instanceof MergeDataRecord) {
        const { merge, recordType } = item;
        switch (recordType) {
          case MERGE_RECORD_TYPE.ADD:
            merges.add(merge);
            break;
          case MERGE_RECORD_TYPE.DELETE:
            merges.deleteIntersects(merge);
            break;
          default: break;
        }
      }
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
    this.goLayerStack = [];
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
