import { Utils } from '../../../utils/Utils';
import { Rect } from '../../../canvas/Rect';
import { BaseFont } from '../../../canvas/font/BaseFont';

class BaseCellsHelper {

  constructor({
    cells, merges, rows, cols, xTableAreaView,
  }) {
    this.xTableAreaView = xTableAreaView;
    this.cells = cells;
    this.merges = merges;
    this.rows = rows;
    this.cols = cols;
  }

  getCellOverFlow(ri, ci, rect, cell) {
    const { xTableAreaView } = this;
    const { fontAttr } = cell;
    const {
      direction, textWrap, angle,
    } = fontAttr;
    const {
      x, y, height,
    } = rect;
    if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
      if (angle === 0) {
        const max = this.getCellTextMaxWidth(ri, ci);
        return new Rect({
          x: x + max.offset, y, width: max.width, height,
        });
      }
      const scrollView = xTableAreaView.getScrollView();
      return new Rect({
        x: 0, y, width: scrollView.w, height,
      });
    }
    if (textWrap === BaseFont.TEXT_WRAP.OVER_FLOW) {
      const max = this.getCellTextMaxWidth(ri, ci);
      return new Rect({
        x: x + max.offset, y, width: max.width, height,
      });
    }
    return null;
  }

  getCellTextMaxWidth(ri, ci) {
    const { cells, cols, merges } = this;
    const cell = cells.getCell(ri, ci);
    const { fontAttr } = cell;
    const { align } = fontAttr;
    let width = 0;
    let offset = 0;
    if (align === BaseFont.ALIGN.left) {
      // 计算当前单元格右边
      // 空白的单元格的总宽度
      for (let i = ci, { len } = cols; i <= len; i += 1) {
        const cell = cells.getCell(ri, i);
        const merge = merges.getFirstIncludes(ri, i);
        if (i === ci) {
          width += cols.getWidth(i);
        } else if ((Utils.isUnDef(cell) || Utils.isBlank(cell.text)) && Utils.isUnDef(merge)) {
          width += cols.getWidth(i);
        } else {
          break;
        }
      }
    } else if (align === BaseFont.ALIGN.center) {
      let rightWidth = 0;
      let leftWidth = 0;
      for (let i = ci + 1, { len } = cols; i <= len; i += 1) {
        const cell = cells.getCell(ri, i);
        const merge = merges.getFirstIncludes(ri, i);
        if ((Utils.isUnDef(cell) || Utils.isBlank(cell.text)) && Utils.isUnDef(merge)) {
          rightWidth += cols.getWidth(i);
        } else {
          break;
        }
      }
      for (let i = ci - 1; i >= 0; i -= 1) {
        const cell = cells.getCell(ri, i);
        const merge = merges.getFirstIncludes(ri, i);
        if ((Utils.isUnDef(cell) || Utils.isBlank(cell.text)) && Utils.isUnDef(merge)) {
          const tmp = cols.getWidth(i);
          leftWidth += tmp;
          offset -= tmp;
        } else {
          break;
        }
      }
      width = cols.getWidth(ci) + leftWidth + rightWidth;
    } else if (align === BaseFont.ALIGN.right) {
      // 计算当前单元格左边
      // 空白的单元格的总宽度
      for (let i = ci; i >= 0; i -= 1) {
        const cell = cells.getCell(ri, i);
        const merge = merges.getFirstIncludes(ri, i);
        if (i === ci) {
          width += cols.getWidth(i);
        } else if ((Utils.isUnDef(cell) || Utils.isBlank(cell.text)) && Utils.isUnDef(merge)) {
          const tmp = cols.getWidth(i);
          width += tmp;
          offset -= tmp;
        } else {
          break;
        }
      }
    }
    return { width, offset };
  }
}

export {
  BaseCellsHelper,
};
