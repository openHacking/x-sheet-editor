import { LineFilter } from '../LineFilter';
import { Utils } from '../../../../../utils/Utils';

class TopBorderDiffFilter extends LineFilter {

  constructor({
    cells,
  }) {
    super((ri, ci) => {
      const next = cells.getCell(ri - 1, ci);
      const cell = cells.getCell(ri, ci);
      // 当前单元格不存在
      if (Utils.isUnDef(cell)) {
        return false;
      }
      const { top } = cell.borderAttr;
      // 对面的单元格不存在
      if (Utils.isUnDef(next)) {
        return top.display;
      }
      // 对面的单元格不需要显示
      const { bottom } = next.borderAttr;
      if (!bottom.display) {
        return top.display;
      }
      // 比较优先级
      return top.priority(bottom) === 1;
    });
  }

}

export {
  TopBorderDiffFilter,
};
