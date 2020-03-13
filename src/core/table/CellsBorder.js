import { Utils } from '../../utils/Utils';

class CellsBorder {

  // eslint-disable-next-line no-unused-vars
  getMergeCellOrCell(ri, ci) {
    throw new TypeError('child class implement');
  }

  borderEqual(src, target) {
    const color = src.color === target.color;
    const width = src.width === target.width;
    const type = src.type === target.type;
    return color && width && type;
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
    return !Utils.isUnDef(cell) && cell.borderAttr.left.display;
  }

  isDisplayTopBorder(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return !Utils.isUnDef(cell) && cell.borderAttr.top.display;
  }

  isDisplayRightBorder(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return !Utils.isUnDef(cell) && cell.borderAttr.right.display;
  }

  isDisplayBottomBorder(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return !Utils.isUnDef(cell) && cell.borderAttr.bottom.display;
  }

  getLeftBorderType(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return cell && cell.borderAttr.left.type;
  }

  getRightBorderType(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return cell && cell.borderAttr.right.type;
  }

  getTopBorderType(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return cell && cell.borderAttr.top.type;
  }

  getBottomBorderType(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return cell && cell.borderAttr.bottom.type;
  }
}

export { CellsBorder };
