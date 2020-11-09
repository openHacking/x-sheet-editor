import { TableAngleBar } from './TableAngleBar';
import { ChainLogic, FilterChain } from '../linefilter/FilterChain';

class TableHorizontalAngelBar extends TableAngleBar {

  getBottomHorizontalLine({
    viewRange,
  }) {
    const {
      horizontalAngleBarRowHas,
      horizontalAngleBarMustFilter,
      horizontalMergeFilter,
      bottomBorderDiffFilter,
    } = this;
    return this.computerBottomHorizontalLine({
      viewRange,
      filter: new FilterChain(ChainLogic.AND, [
        horizontalAngleBarRowHas,
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
      horizontalAngleBarRowHas,
      horizontalAngleBarMustFilter,
      horizontalMergeFilter,
      topBorderDiffFilter,
    } = this;
    return this.computerTopHorizontalLine({
      viewRange,
      filter: new FilterChain(ChainLogic.AND, [
        horizontalAngleBarRowHas,
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
