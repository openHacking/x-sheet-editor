import { LineFilter } from '../LineFilter';
import { PlainUtils } from '../../../../../utils/PlainUtils';

class TopBorderDiffFilter extends LineFilter {

  constructor({
    cells,
  }) {
    super((ri, ci) => {
      const next = cells.getCell(ri - 1, ci);
      const cell = cells.getCell(ri, ci);
      // 当前单元格不存在
      if (PlainUtils.isUnDef(cell)) {
        return LineFilter.RETURN_TYPE.JUMP;
      }
      const { top } = cell.borderAttr;
      // 对面的单元格不存在
      if (PlainUtils.isUnDef(next)) {
        return top.display
          ? LineFilter.RETURN_TYPE.HANDLE
          : LineFilter.RETURN_TYPE.JUMP;
      }
      // 对面的单元格不需要显示
      const { bottom } = next.borderAttr;
      if (!bottom.display) {
        return top.display
          ? LineFilter.RETURN_TYPE.HANDLE
          : LineFilter.RETURN_TYPE.JUMP;
      }
      // 比较优先级
      return top.priority(bottom) === 1
        ? LineFilter.RETURN_TYPE.HANDLE
        : LineFilter.RETURN_TYPE.JUMP;
    });
  }

}

export {
  TopBorderDiffFilter,
};
