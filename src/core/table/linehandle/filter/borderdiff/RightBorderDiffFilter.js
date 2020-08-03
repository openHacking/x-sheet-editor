import { LineFilter } from '../LineFilter';
import { Utils } from '../../../../../utils/Utils';

class RightBorderDiffFilter extends LineFilter {

  constructor({
    cells,
  }) {
    super((ci, ri) => {
      const next = cells.getCell(ri, ci + 1);
      const cell = cells.getCell(ri, ci);
      // 当前单元格不存在
      if (Utils.isUnDef(cell)) {
        return false;
      }
      const { right } = cell.borderAttr;
      // 对面的单元格不存在
      if (Utils.isUnDef(next)) {
        return right.display;
      }
      // 对面的单元格不需要显示
      const { left } = next.borderAttr;
      if (!left.display) {
        return right.display;
      }
      // 比较优先级
      const result = right.priority(left);
      return result === 1 || result === 0;
    });
  }

}

export {
  RightBorderDiffFilter,
};
