import { TableAngleBar } from './TableAngleBar';
import { ChainLogic, FilterChain } from '../linefilter/FilterChain';

class TableHorizontalAngelBar extends TableAngleBar {

  getBottomHorizontalLine({
    viewRange,
  }) {
    const {
      horizontalAngleBarMustFilter,
      horizontalMergeFilter,
      bottomBorderDiffFilter,
    } = this;
    return this.computerBottomHorizontalLine({
      viewRange,
      filter: new FilterChain(ChainLogic.AND, [
        horizontalAngleBarMustFilter,
        horizontalMergeFilter,
        bottomBorderDiffFilter,
      ]),
    });
  }

  getTopHorizontalLine({
    viewRange,
  }) {
    const {
      horizontalAngleBarMustFilter,
      horizontalMergeFilter,
      topBorderDiffFilter,
    } = this;
    return this.computerTopHorizontalLine({
      viewRange,
      filter: new FilterChain(ChainLogic.AND, [
        horizontalAngleBarMustFilter,
        horizontalMergeFilter,
        topBorderDiffFilter,
      ]),
    });
  }

}

export {
  TableHorizontalAngelBar,
};
