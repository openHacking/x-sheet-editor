import { TableCellDataProxy } from './proxy/TableCellDataProxy';
import { CellDataRecord } from './record/CellDataRecord';
import { MERGE_RECORD_TYPE, MergeDataRecord } from './record/MergeDataRecord';
import { TableMergeDataProxy } from './proxy/TableMergeDataProxy';
import { ColsWidthDataRecord } from './record/ColsWidthDataRecord';
import { RowsHeightDataRecord } from './record/RowsHeightDataRecord';
import { TableColsWidthDataProxy } from './proxy/TableColsWidthDataProxy';
import { TableRowsHeightDataProxy } from './proxy/TableRowsHeightDataProxy';

class TableDataSnapshot {

  constructor({
    table, cells, merges, cols, rows,
  }) {
    this.record = false;
    this.backLayerStack = [];
    this.recordLayer = [];
    this.goLayerStack = [];
    this.table = table;
    this.cells = cells;
    this.merges = merges;
    this.cols = cols;
    this.rows = rows;
    this.mergeDataProxy = new TableMergeDataProxy(this, {
      on: {
        deleteMerge: (merge) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new MergeDataRecord({ merge, recordType: MERGE_RECORD_TYPE.DELETE }));
        },
        addMerge: (merge) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new MergeDataRecord({ merge, recordType: MERGE_RECORD_TYPE.ADD }));
        },
      },
    });
    this.cellDataProxy = new TableCellDataProxy(this, {
      on: {
        setCell: (ri, ci, oldCell, newCell) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new CellDataRecord({ ri, ci, oldCell, newCell }));
        },
      },
    });
    this.colsWidthDataProxy = new TableColsWidthDataProxy(this, {
      on: {
        setWidth: (ci, oldWidth, newWidth) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new ColsWidthDataRecord({ ci, oldWidth, newWidth }));
        },
      },
    });
    this.rowsHeightDataProxy = new TableRowsHeightDataProxy(this, {
      on: {
        setHeight: (ri, oldHeight, newHeight) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new RowsHeightDataRecord({ ri, oldHeight, newHeight }));
        },
      },
    });
  }

  back() {
    const { backLayerStack, goLayerStack } = this;
    const layer = backLayerStack.pop();
    for (let i = layer.length - 1; i >= 0; i -= 1) {
      const item = layer[i];
      // 单元格元素
      if (item instanceof CellDataRecord) {
        const { ri, ci, oldCell } = item;
        this.cellDataProxy.$setCell(ri, ci, oldCell);
        continue;
      }
      // 合并单元格元素
      if (item instanceof MergeDataRecord) {
        const { recordType } = item;
        switch (recordType) {
          case MERGE_RECORD_TYPE.DELETE: {
            const { merge } = item;
            this.mergeDataProxy.$addMerge(merge);
            break;
          }
          case MERGE_RECORD_TYPE.ADD: {
            const { merge } = item;
            this.mergeDataProxy.$deleteMerge(merge);
            break;
          }
          default: break;
        }
        continue;
      }
      //  列宽元素
      if (item instanceof ColsWidthDataRecord) {
        const { ci, oldWidth } = item;
        this.colsWidthDataProxy.$setWidth(ci, oldWidth);
        continue;
      }
      // 行高元素
      if (item instanceof RowsHeightDataRecord) {
        const { ri, oldHeight } = item;
        this.rowsHeightDataProxy.$setHeight(ri, oldHeight);
      }
    }
    goLayerStack.push(layer);
    this.mergeDataProxy.backNotice();
    this.cellDataProxy.backNotice();
    this.colsWidthDataProxy.backNotice();
    this.rowsHeightDataProxy.backNotice();
  }

  go() {
    const { backLayerStack, goLayerStack } = this;
    const layer = goLayerStack.pop();
    for (let i = 0, len = layer.length; i < len; i += 1) {
      const item = layer[i];
      // 单元格元素
      if (item instanceof CellDataRecord) {
        const { ri, ci, newCell } = item;
        this.cellDataProxy.$setCell(ri, ci, newCell);
        continue;
      }
      // 合并单元格元素
      if (item instanceof MergeDataRecord) {
        const { recordType } = item;
        switch (recordType) {
          case MERGE_RECORD_TYPE.DELETE: {
            const { merge } = item;
            this.mergeDataProxy.$deleteMerge(merge);
            break;
          }
          case MERGE_RECORD_TYPE.ADD: {
            const { merge } = item;
            this.mergeDataProxy.$addMerge(merge);
            break;
          }
          default: break;
        }
        continue;
      }
      //  列宽元素
      if (item instanceof ColsWidthDataRecord) {
        const { ci, newWidth } = item;
        this.colsWidthDataProxy.$setWidth(ci, newWidth);
        continue;
      }
      // 行高元素
      if (item instanceof RowsHeightDataRecord) {
        const { ri, newHeight } = item;
        this.rowsHeightDataProxy.$setHeight(ri, newHeight);
      }
    }
    backLayerStack.push(layer);
    this.mergeDataProxy.goNotice();
    this.cellDataProxy.goNotice();
    this.colsWidthDataProxy.goNotice();
    this.rowsHeightDataProxy.goNotice();
  }

  end() {
    const { recordLayer, backLayerStack } = this;
    this.record = false;
    if (recordLayer.length) {
      backLayerStack.push(recordLayer);
    }
    this.recordLayer = [];
    this.mergeDataProxy.endNotice();
    this.cellDataProxy.endNotice();
    this.colsWidthDataProxy.endNotice();
    this.rowsHeightDataProxy.endNotice();
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
