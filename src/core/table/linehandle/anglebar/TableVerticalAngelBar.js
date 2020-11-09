import { TableAngleBar } from './TableAngleBar';
import { ChainLogic, FilterChain } from '../linefilter/FilterChain';

class TableVerticalAngelBar extends TableAngleBar {

  getRightVerticalLine({
    viewRange,
  }) {
    const {
      verticalAngleBarRowHas,
      verticalAngleBarMuseFilter,
      verticalMergeFilter,
      rightBorderDiffFilter,
    } = this;
    return this.computerRightVerticalLine({
      viewRange,
      filter: new FilterChain(ChainLogic.AND, [
        verticalAngleBarRowHas,
        verticalAngleBarMuseFilter,
        verticalMergeFilter,
        rightBorderDiffFilter,
      ]),
    });
  }

  getLeftVerticalLine({
    viewRange,
  }) {
    const {
      verticalAngleBarRowHas,
      verticalAngleBarMuseFilter,
      verticalMergeFilter,
      leftBorderDiffFilter,
    } = this;
    return this.computerLeftVerticalLine({
      viewRange,
      filter: new FilterChain(ChainLogic.AND, [
        verticalAngleBarRowHas,
        verticalAngleBarMuseFilter,
        verticalMergeFilter,
        leftBorderDiffFilter,
      ]),
    });
  }

}

export {
  TableVerticalAngelBar,
};
