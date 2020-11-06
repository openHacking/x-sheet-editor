import { TableGrid } from './TableGrid';
import { ChainLogic, FilterChain } from '../linefilter/FilterChain';

class TableVerticalGrid extends TableGrid {

  getVerticalLine({
    viewRange,
  }) {
    const {
      verticalMergeFilter,
      verticalBorderDisplayFilter,
      rightOutRangeFilter,
      drawCheck,
    } = this;
    let result;
    if (drawCheck) {
      result = this.computerVerticalLine({
        viewRange,
        filter: new FilterChain(ChainLogic.AND, [
          verticalMergeFilter,
          verticalBorderDisplayFilter,
          rightOutRangeFilter,
        ]),
      });
    } else {
      result = this.computerVerticalLine({ viewRange });
    }
    return result;
  }

  getMergeVerticalLine({
    brink,
  }) {
    let result = [];
    const {
      verticalBorderDisplayFilter,
      drawCheck,
    } = this;
    if (drawCheck) {
      for (let i = 0; i < brink.length; i += 1) {
        const { right } = brink[i];
        if (right) {
          const { view, x, y } = right;
          const item = this.computerVerticalLine({
            viewRange: view,
            bx: x,
            by: y,
            filter: verticalBorderDisplayFilter,
          });
          result = result.concat(item);
        }
      }
    } else {
      for (let i = 0; i < brink.length; i += 1) {
        const { right } = brink[i];
        if (right) {
          const { view, x, y } = right;
          const item = this.computerVerticalLine({
            viewRange: view,
            bx: x,
            by: y,
          });
          result = result.concat(item);
        }
      }
    }
    return result;
  }

}

export {
  TableVerticalGrid,
};
