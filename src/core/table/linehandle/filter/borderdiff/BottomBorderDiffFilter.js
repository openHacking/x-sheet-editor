import { LineFilter } from '../LineFilter';
import { Utils } from '../../../../../utils/Utils';

class BottomBorderDiffFilter extends LineFilter {

  constructor({
    cells,
  }) {
    super((ri, ci) => {
      const next = cells.getMergeCellOrCell(ri + 1, ci);
      const cell = cells.getMergeCellOrCell(ri, ci);
      // 当前单元格不存在
      if (Utils.isUnDef(cell)) {
        return false;
      }
      const { bottom } = cell.borderAttr;
      // 对面的单元格不存在
      if (Utils.isUnDef(next)) {
        return bottom.display;
      }
      // 对面的单元格不需要显示
      const { top } = next.borderAttr;
      if (!top.display) {
        return bottom.display;
      }
      // 比较优先级
      const result = bottom.compareTime(top);
      return result === 1 || result === 0;
    });
  }

}

export {
  BottomBorderDiffFilter,
};
