import { Constant } from '../../constant/Constant';
import { TableCellDataProxy } from './proxy/TableCellDataProxy';
import { CellDataRecord } from './record/CellDataRecord';
import { MERGE_RECORD_TYPE, MergeDataRecord } from './record/MergeDataRecord';
import { ChartDataRecord } from './record/ChartDataRecord';
import { TableMergeDataProxy } from './proxy/TableMergeDataProxy';
import { TableColsDataProxy } from './proxy/TableColsDataProxy';
import { ColsDataRecord } from './record/ColsDataRecord';
import { TableRowsDataProxy } from './proxy/TableRowsDataProxy';
import { RowsDataRecord } from './record/RowsDataRecord';

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
    this.colsDataProxy = new TableColsDataProxy(table, {
      on: {
        setWidth: (ci, oldWidth, newWidth) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new ColsDataRecord({ ci, oldWidth, newWidth }));
        },
      },
    });
    this.rowsDataProxy = new TableRowsDataProxy(table, {
      on: {
        setHeight: (ri, oldHeight, newHeight) => {
          if (this.record === false) return;
          const { recordLayer } = this;
          recordLayer.push(new RowsDataRecord({ ri, oldHeight, newHeight }));
        },
      },
    });
  }

  back() {
    const { backLayerStack, goLayerStack, table } = this;
    const { cells, merges, cols, rows } = table;
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
        continue;
      }
      // 图表元素
      if (item instanceof ChartDataRecord) {
        // TODO...
        // ...
      }
      //  列宽元素
      if (item instanceof ColsDataRecord) {
        const { ci, oldWidth } = item;
        cols.setWidth(ci, oldWidth);
        continue;
      }
      // 行高元素
      if (item instanceof RowsDataRecord) {
        const { ri, oldHeight } = item;
        rows.setHeight(ri, oldHeight);
      }
    }
    this.mergeDataProxy.backNotice();
    this.cellDataProxy.backNotice();
    this.colsDataProxy.backNotice();
    this.rowsDataProxy.backNotice();
    goLayerStack.push(layer);
    table.render();
  }

  go() {
    const { backLayerStack, goLayerStack, table } = this;
    const { cells, merges, cols, rows } = table;
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
        continue;
      }
      // 图表元素
      if (item instanceof ChartDataRecord) {
        // TODO...
        // ...
      }
      //  列宽元素
      if (item instanceof ColsDataRecord) {
        const { ci, newWidth } = item;
        cols.setWidth(ci, newWidth);
        continue;
      }
      // 行高元素
      if (item instanceof RowsDataRecord) {
        const { ri, newHeight } = item;
        rows.setHeight(ri, newHeight);
      }
    }
    this.mergeDataProxy.goNotice();
    this.cellDataProxy.goNotice();
    this.colsDataProxy.goNotice();
    this.rowsDataProxy.goNotice();
    backLayerStack.push(layer);
    table.render();
  }

  end() {
    const { recordLayer, backLayerStack } = this;
    this.record = false;
    if (recordLayer.length) {
      backLayerStack.push(recordLayer);
    }
    this.recordLayer = [];
    this.mergeDataProxy.end();
    this.cellDataProxy.end();
    this.colsDataProxy.end();
    this.rowsDataProxy.end();
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
