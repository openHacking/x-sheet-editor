import { Utils } from '../../utils/Utils';

class CellsBorder {

  getMergeCellOrCell(ri, ci) {
    const { table } = this;
    const { merges } = table;
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return this.getCell(merge.sri, merge.sci);
    }
    return this.getCell(ri, ci);
  }

  borderComparisonOfTime(sri, sci, tri, tci) {
    const srcCell = this.getMergeCellOrCell(sri, sci);
    const targetCell = this.getMergeCellOrCell(tri, tci);
    if (Utils.isUnDef(srcCell) || Utils.isUnDef(targetCell)) return -2;
    const srcBorderAttr = srcCell.borderAttr;
    const targetBorderAttr = targetCell.borderAttr;
    const srcTime = srcBorderAttr.time;
    const targetTime = targetBorderAttr.time;
    if (srcTime > targetTime) return 1;
    if (targetTime > srcTime) return -1;
    return 0;
  }

  isDisplayLeftBorder(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return cell !== null && cell.borderAttr.left.display;
  }

  isDisplayTopBorder(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return cell !== null && cell.borderAttr.top.display;
  }

  isDisplayRightBorder(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return cell !== null && cell.borderAttr.right.display;
  }

  isDisplayBottomBorder(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return cell !== null && cell.borderAttr.bottom.display;
  }

  borderEqual(src, target) {
    const color = src.color === target.color;
    const width = src.width === target.width;
    const type = src.type === target.type;
    return color && width && type;
  }
}

export { CellsBorder };
