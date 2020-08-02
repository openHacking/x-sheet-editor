import { TableBorder } from './TableBorder';
import { ChainLogic, FilterChain } from '../filter/FilterChain';

class TableHorizontalBorder extends TableBorder {

  getBottomHorizontalLine({
    viewRange,
  }) {
    const {
      horizontalMergeFilter,
      bottomBorderDiffFilter,
    } = this;
    return this.computerBottomHorizontalLine({
      viewRange,
      filter: new FilterChain(ChainLogic.AND, [
        horizontalMergeFilter,
        bottomBorderDiffFilter,
      ]),
    });
  }

  getTopHorizontalLine({
    viewRange,
  }) {
    const {
      horizontalMergeFilter,
      topBorderDiffFilter,
    } = this;
    return this.computerTopHorizontalLine({
      viewRange,
      filter: new FilterChain(ChainLogic.AND, [
        horizontalMergeFilter,
        topBorderDiffFilter,
      ]),
    });
  }

  getBottomMergeHorizontalLine({
    brink,
  }) {
    const {
      bottomBorderDiffFilter,
    } = this;
    let result = [];
    for (let i = 0; i < brink.length; i += 1) {
      const { bottom } = brink[i];
      if (bottom) {
        const item = this.computerBottomHorizontalLine({
          viewRange: bottom.view,
          bx: bottom.x,
          by: bottom.y,
          filter: bottomBorderDiffFilter,
        });
        result = result.concat(item);
      }
    }
    return result;
  }

  getTopMergeHorizontalLine({
    brink,
  }) {
    const {
      topBorderDiffFilter,
    } = this;
    let result = [];
    for (let i = 0; i < brink.length; i += 1) {
      const { top } = brink[i];
      if (top) {
        const item = this.computerTopHorizontalLine({
          viewRange: top.view,
          bx: top.x,
          by: top.y,
          filter: topBorderDiffFilter,
        });
        result = result.concat(item);
      }
    }
    return result;
  }

}

export {
  TableHorizontalBorder,
};
