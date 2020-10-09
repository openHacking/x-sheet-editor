import { PlainUtils } from '../../../utils/PlainUtils';
import { Rect } from '../../../canvas/Rect';
import { BaseFont } from '../../../canvas/font/BaseFont';
import { ColsIterator } from '../iterator/ColsIterator';

class BaseCellsHelper {

  constructor({
    cells,
    merges,
    rows,
    cols,
    xTableAreaView,
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
      ColsIterator.getInstance()
        .setBegin(ci)
        .setEnd(cols.len)
        .setLoop((i) => {
          const merge = merges.getFirstIncludes(ri, i);
          const cell = cells.getCell(ri, i);
          const blank = PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text);
          if (i === ci) {
            width += cols.getWidth(i);
            return true;
          }
          if (blank && PlainUtils.isUnDef(merge)) {
            width += cols.getWidth(i);
            return true;
          }
          return false;
        })
        .execute();
    } else if (align === BaseFont.ALIGN.center) {
      let rightWidth = 0;
      let leftWidth = 0;
      // 右边
      ColsIterator.getInstance()
        .setBegin(ci + 1)
        .setEnd(cols.len)
        .setLoop((i) => {
          const merge = merges.getFirstIncludes(ri, i);
          const cell = cells.getCell(ri, i);
          const blank = PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text);
          if (blank && PlainUtils.isUnDef(merge)) {
            rightWidth += cols.getWidth(i);
            return true;
          }
          return false;
        })
        .execute();
      // 左边
      ColsIterator.getInstance()
        .setBegin(ci - 1)
        .setEnd(0)
        .setLoop((i) => {
          const merge = merges.getFirstIncludes(ri, i);
          const cell = cells.getCell(ri, i);
          const blank = PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text);
          if (blank && PlainUtils.isUnDef(merge)) {
            const tmp = cols.getWidth(i);
            leftWidth += tmp;
            offset -= tmp;
            return true;
          }
          return false;
        })
        .execute();
      // 统计
      width = cols.getWidth(ci) + leftWidth + rightWidth;
    } else if (align === BaseFont.ALIGN.right) {
      // 计算当前单元格左边
      // 空白的单元格的总宽度
      ColsIterator.getInstance()
        .setBegin(ci)
        .setEnd(0)
        .setLoop((i) => {
          const merge = merges.getFirstIncludes(ri, i);
          const cell = cells.getCell(ri, i);
          const blank = PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text);
          if (i === ci) {
            width += cols.getWidth(i);
            return true;
          }
          if (blank && PlainUtils.isUnDef(merge)) {
            const tmp = cols.getWidth(i);
            width += tmp;
            offset -= tmp;
            return true;
          }
          return false;
        })
        .execute();
    }
    return { width, offset };
  }

}

export {
  BaseCellsHelper,
};
