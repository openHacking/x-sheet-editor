import { TableBorder } from './TableBorder';
import { ChainLogic, FilterChain } from '../filter/FilterChain';

class TableVerticalBorder extends TableBorder {

  getRightVerticalLine({
    viewRange,
  }) {
    const {
      verticalMergeFilter,
      rightBorderDiffFilter,
      rightVerticalAngleBarFilter,
      rightOutRangeFilter,
    } = this;
    return this.computerRightVerticalLine({
      viewRange,
      filter: new FilterChain(ChainLogic.AND, [
        verticalMergeFilter,
        rightBorderDiffFilter,
        rightVerticalAngleBarFilter,
        rightOutRangeFilter,
      ]),
    });
  }

  getLeftVerticalLine({
    viewRange,
  }) {
    const {
      verticalMergeFilter,
      leftBorderDiffFilter,
      leftVerticalAngleBarFilter,
      leftOutRangeFilter,
    } = this;
    return this.computerLeftVerticalLine({
      viewRange,
      filter: new FilterChain(ChainLogic.AND, [
        verticalMergeFilter,
        leftVerticalAngleBarFilter,
        leftBorderDiffFilter,
        leftOutRangeFilter,
      ]),
    });
  }

  getRightMergeVerticalLine({
    brink,
  }) {
    const {
      rightBorderDiffFilter,
    } = this;
    let result = [];
    for (let i = 0; i < brink.length; i += 1) {
      const { right } = brink[i];
      if (right) {
        const item = this.computerRightVerticalLine({
          viewRange: right.view,
          bx: right.x,
          by: right.y,
          filter: rightBorderDiffFilter,
        });
        result = result.concat(item);
      }
    }
    return result;
  }

  getLeftMergeVerticalLine({
    brink,
  }) {
    const {
      leftBorderDiffFilter,
    } = this;
    let result = [];
    for (let i = 0; i < brink.length; i += 1) {
      const { left } = brink[i];
      if (left) {
        const item = this.computerLeftVerticalLine({
          viewRange: left.view,
          bx: left.x,
          by: left.y,
          filter: leftBorderDiffFilter,
        });
        result = result.concat(item);
      }
    }
    return result;
  }

}

export {
  TableVerticalBorder,
};
