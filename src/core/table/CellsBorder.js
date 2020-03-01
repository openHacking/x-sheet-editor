import { Utils } from '../../utils/Utils';

class CellsBorder {

  borderComparisonOfTime(sri, sci, tri, tci) {
    const srcCell = this.getMergeCellOrCell(sri, sci);
    const targetCell = this.getMergeCellOrCell(tri, tci);
    if (Utils.isUnDef(srcCell) || Utils.isUnDef(targetCell)) return -2;
    if (srcCell.time > targetCell.time) return 1;
    if (targetCell.time > srcCell.time) return -1;
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

  setDisplayLeftBorder(ri, ci, attr) {
    const cell = this.getMergeCellOrCell(ri, ci);
    if (cell) {
      cell.borderAttr.time = Utils.now();
      cell.borderAttr.left = attr;
    }
  }

  setDisplayTopBorder(ri, ci, attr) {
    const cell = this.getMergeCellOrCell(ri, ci);
    if (cell) {
      cell.borderAttr.time = Utils.now();
      cell.borderAttr.top = attr;
    }
  }

  setDisplayRightBorder(ri, ci, attr) {
    const cell = this.getMergeCellOrCell(ri, ci);
    if (cell) {
      cell.borderAttr.time = Utils.now();
      cell.borderAttr.right = attr;
    }
  }

  setDisplayBottomBorder(ri, ci, attr) {
    const cell = this.getMergeCellOrCell(ri, ci);
    if (cell) {
      cell.borderAttr.time = Utils.now();
      cell.borderAttr.bottom = attr;
    }
  }

}

export { CellsBorder };
