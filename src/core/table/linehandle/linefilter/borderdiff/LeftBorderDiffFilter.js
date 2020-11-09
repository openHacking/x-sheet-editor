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
        return LineFilter.RETURN_TYPE.JUMP;
      }
      const { left } = cell.borderAttr;
      // 对面的单元格不存在
      if (PlainUtils.isUnDef(next)) {
        return left.display
          ? LineFilter.RETURN_TYPE.HANDLE
          : LineFilter.RETURN_TYPE.JUMP;
      }
      // 对面的单元格不需要显示
      const { right } = next.borderAttr;
      if (!right.display) {
        return left.display
          ? LineFilter.RETURN_TYPE.HANDLE
          : LineFilter.RETURN_TYPE.JUMP;
      }
      // 比较优先级
      return left.priority(right) === 1
        ? LineFilter.RETURN_TYPE.HANDLE
        : LineFilter.RETURN_TYPE.JUMP;
    });
  }

}

export {
  LeftBorderDiffFilter,
};
