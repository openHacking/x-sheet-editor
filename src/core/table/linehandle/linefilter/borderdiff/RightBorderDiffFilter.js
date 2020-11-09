import { LineFilter } from '../LineFilter';
import { PlainUtils } from '../../../../../utils/PlainUtils';

class RightBorderDiffFilter extends LineFilter {

  constructor({
    cells,
  }) {
    super((ci, ri) => {
      const next = cells.getCell(ri, ci + 1);
      const cell = cells.getCell(ri, ci);
      // 当前单元格不存在
      if (PlainUtils.isUnDef(cell)) {
        return LineFilter.RETURN_TYPE.JUMP;
      }
      const { right } = cell.borderAttr;
      // 对面的单元格不存在
      if (PlainUtils.isUnDef(next)) {
        return right.display
          ? LineFilter.RETURN_TYPE.HANDLE
          : LineFilter.RETURN_TYPE.JUMP;
      }
      // 对面的单元格不需要显示
      const { left } = next.borderAttr;
      if (!left.display) {
        return right.display
          ? LineFilter.RETURN_TYPE.HANDLE
          : LineFilter.RETURN_TYPE.JUMP;
      }
      // 比较优先级
      const result = right.priority(left);
      return result === 1 || result === 0
        ? LineFilter.RETURN_TYPE.HANDLE
        : LineFilter.RETURN_TYPE.JUMP;
    });
  }

}

export {
  RightBorderDiffFilter,
};
