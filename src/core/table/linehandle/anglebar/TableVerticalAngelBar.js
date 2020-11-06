import { TableAngleBar } from './TableAngleBar';
import { ChainLogic, FilterChain } from '../linefilter/FilterChain';

class TableVerticalAngelBar extends TableAngleBar {

  getRightVerticalLine({
    viewRange,
  }) {
    const {
      verticalAngleBarMuseFilter,
      verticalMergeFilter,
      rightBorderDiffFilter,
    } = this;
    return this.computerRightVerticalLine({
      viewRange,
      filter: new FilterChain(ChainLogic.AND, [
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
      verticalAngleBarMuseFilter,
      verticalMergeFilter,
      leftBorderDiffFilter,
    } = this;
    return this.computerLeftVerticalLine({
      viewRange,
      filter: new FilterChain(ChainLogic.AND, [
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
