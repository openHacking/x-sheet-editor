import { TableGrid } from './TableGrid';
import { ChainLogic, FilterChain } from '../linefilter/FilterChain';

class TableHorizontalGrid extends TableGrid {

  getHorizontalLine({
    viewRange,
  }) {
    const {
      horizontalMergeFilter,
      horizontalBorderDisplayFilter,
      drawCheck,
    } = this;
    let result;
    if (drawCheck) {
      result = this.computerHorizontalLine({
        viewRange,
        filter: new FilterChain(ChainLogic.AND, [
          horizontalMergeFilter,
          horizontalBorderDisplayFilter,
        ]),
      });
    } else {
      result = this.computerHorizontalLine({ viewRange });
    }
    return result;
  }

  getMergeHorizontalLine({
    brink,
  }) {
    let result = [];
    const {
      horizontalBorderDisplayFilter,
      drawCheck,
    } = this;
    if (drawCheck) {
      for (let i = 0; i < brink.length; i += 1) {
        const { bottom } = brink[i];
        if (bottom) {
          const { view, x, y } = bottom;
          const item = this.computerHorizontalLine({
            viewRange: view,
            bx: x,
            by: y,
            filter: horizontalBorderDisplayFilter,
          });
          result = result.concat(item);
        }
      }
    } else {
      for (let i = 0; i < brink.length; i += 1) {
        const { bottom } = brink[i];
        if (bottom) {
          const { view, x, y } = bottom;
          const item = this.computerHorizontalLine({
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
  TableHorizontalGrid,
};
