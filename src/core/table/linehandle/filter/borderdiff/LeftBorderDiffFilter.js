import { LineFilter } from '../LineFilter';
import { PlainUtils } from '../../../../../utils/PlainUtils';

class LeftBorderDiffFilter extends LineFilter {

  constructor({
    cells,
  }) {
    super((ci, ri) => {
      const next = cells.getCell(ri, ci - 1);
      const cell = cells.getCell(ri, ci);
      // 当前单元格不存在
      if (PlainUtils.isUnDef(cell)) {
        return false;
      }
      const { left } = cell.borderAttr;
      // 对面的单元格不存在
      if (PlainUtils.isUnDef(next)) {
        return left.display;
      }
      // 对面的单元格不需要显示
      const { right } = next.borderAttr;
      if (!right.display) {
        return left.display;
      }
      // 比较优先级
      return left.priority(right) === 1;
    });
  }

}

export {
  LeftBorderDiffFilter,
};
