import { Utils } from '../../../utils/Utils';
import { Rect } from '../../../canvas/Rect';
import { BaseFont } from '../../../canvas/font/BaseFont';

class BaseCellsHelper {

  constructor({
    cells, merges, rows, cols, scale,
  }) {
    this.cells = cells;
    this.merges = merges;
    this.rows = rows;
    this.cols = cols;
    this.scale = scale;
  }

  getCellOverFlow(ri, ci, rect, cell) {
    const { fontAttr } = cell;
    const {
      direction, textWrap,
    } = fontAttr;
    const { x, y, width, height } = rect;
    if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
      return null;
    }
    if (direction === BaseFont.TEXT_DIRECTION.VERTICAL) {
      const max = this.getCellTextMaxHeight(ri, ci);
      return new Rect({
        x, y: y + max.offset, width, height: max.height,
      });
    }
    const max = this.getCellTextMaxWidth(ri, ci);
    return new Rect({
      x: x + max.offset, y, width: max.width, height,
    });
  }

  getCellTextMaxHeight(ri, ci) {
    const { cells, rows } = this;
    const cell = cells.getCell(ri, ci);
    const { fontAttr } = cell;
    const { verticalAlign } = fontAttr;
    let height = 0;
    let offset = 0;
    if (verticalAlign === BaseFont.VERTICAL_ALIGN.top) {
      for (let i = ri, { len } = rows; i <= len; i += 1) {
        const cell = cells.getCell(i, ci);
        if (i === ci) {
          height += rows.getHeight(i);
        } else if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          height += rows.getHeight(i);
        } else {
          break;
        }
      }
    } else if (verticalAlign === BaseFont.VERTICAL_ALIGN.center) {
      for (let i = ri, { len } = rows; i <= len; i += 1) {
        const cell = cells.getCell(i, ci);
        if (i === ci) {
          height += rows.getHeight(i);
        } else if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          height += rows.getHeight(i);
        } else {
          break;
        }
      }
      for (let i = ri - 1; i >= 0; i -= 1) {
        const cell = cells.getCell(ri, i);
        if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          const tmp = rows.getHeight(i);
          height += tmp;
          offset -= tmp;
        } else {
          break;
        }
      }
    } else if (verticalAlign === BaseFont.VERTICAL_ALIGN.bottom) {
      for (let i = ri; i >= 0; i -= 1) {
        const cell = cells.getCell(ri, i);
        if (i === ci) {
          height += rows.getHeight(i);
        } else if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          const tmp = rows.getHeight(i);
          height += tmp;
          offset -= tmp;
        } else {
          break;
        }
      }
    }
    return { height, offset };
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
