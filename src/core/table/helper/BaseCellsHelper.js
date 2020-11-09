import { PlainUtils } from '../../../utils/PlainUtils';
import { Rect } from '../../../canvas/Rect';
import { RTCosKit, RTSinKit } from '../../../canvas/RTFunction';
import { BaseFont } from '../../../canvas/font/BaseFont';
import { ColsIterator } from '../iterator/ColsIterator';

class BaseCellsHelper {

  constructor({
    cells,
    merges,
    rows,
    cols,
    tableDataSnapshot,
    xTableAreaView,
  }) {
    this.tableDataSnapshot = tableDataSnapshot;
    this.xTableAreaView = xTableAreaView;
    this.cells = cells;
    this.merges = merges;
    this.rows = rows;
    this.cols = cols;
  }

  getCellOverFlow(ri, ci, rect, cell) {
    const { x, y, height } = rect;
    const { fontAttr } = cell;
    const { direction } = fontAttr;
    switch (direction) {
      case BaseFont.TEXT_DIRECTION.HORIZONTAL: {
        const { textWrap } = fontAttr;
        if (textWrap === BaseFont.TEXT_WRAP.OVER_FLOW) {
          const max = this.getHorizontalMaxWidth(ri, ci, cell);
          return new Rect({
            x: x + max.offset, y, width: max.width, height,
          });
        }
        break;
      }
      case BaseFont.TEXT_DIRECTION.ANGLE: {
        const { textWrap } = fontAttr;
        if (cell.isAngleBarCell()) {
          switch (textWrap) {
            case BaseFont.TEXT_WRAP.OVER_FLOW:
            case BaseFont.TEXT_WRAP.TRUNCATE: {
              const max = this.getAngleBarMaxWidth(ri, ci, cell, rect);
              return new Rect({
                x: x + max.offset, y, width: max.width, height,
              });
            }
            case BaseFont.TEXT_WRAP.WORD_WRAP: {
              const max = this.getAngleBarWrapWidth(ri, ci, cell, rect);
              return new Rect({
                x: x + max.offset, y, width: max.width, height,
              });
            }
          }
        } else {
          switch (textWrap) {
            case BaseFont.TEXT_WRAP.OVER_FLOW:
            case BaseFont.TEXT_WRAP.TRUNCATE: {
              const max = this.getAngleMaxWidth(ri, ci, cell, rect);
              return new Rect({
                x: x + max.offset, y, width: max.width, height,
              });
            }
          }
        }
        break;
      }
    }
    return null;
  }

  getHorizontalMaxWidth(ri, ci, cell) {
    const { cells, cols, merges } = this;
    const { fontAttr } = cell;
    const { align } = fontAttr;
    let width = 0;
    let offset = 0;
    switch (align) {
      case BaseFont.ALIGN.left: {
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
        break;
      }
      case BaseFont.ALIGN.center: {
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
        break;
      }
      case BaseFont.ALIGN.right: {
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
        break;
      }
    }
    return { width, offset };
  }

  getAngleBarWrapWidth(ri, ci, cell, rect) {
    const { xTableAreaView, cols, merges } = this;
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return merge;
    }
    const scrollView = xTableAreaView.getScrollView();
    const { eci } = scrollView;
    const { fontAttr } = cell;
    const { angle } = fontAttr;
    let width = 0;
    let offset = 0;
    if (angle > 0) {
      width = cols.sectionSumWidth(ci, eci);
    } else {
      width = cols.sectionSumWidth(0, ci - 1) + rect.width;
      offset = -(width - rect.width);
    }
    return { width, offset };
  }

  getAngleBarMaxWidth(ri, ci, cell, rect) {
    const { rows, merges } = this;
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return merge;
    }
    const { fontAttr } = cell;
    const { angle } = fontAttr;
    const rowHeight = rows.getHeight(ri);
    const tilt = RTSinKit.tilt({
      inverse: rowHeight,
      angle,
    });
    let width = RTCosKit.nearby({ tilt, angle });
    let offset = 0;
    if (angle < 0) {
      width = RTCosKit.nearby({ tilt, angle }) + rect.width;
      offset = -width;
    }
    return { width, offset };
  }

  getAngleMaxWidth(ri, ci, cell, rect) {
    const { cols, rows, merges } = this;
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return merge;
    }
    const { fontAttr } = cell;
    const { angle, align, padding } = fontAttr;
    const rowHeight = rows.getHeight(ri);
    const tilt = RTSinKit.tilt({
      inverse: rowHeight,
      angle,
    });
    let haveWidth = RTCosKit.nearby({ tilt, angle });
    let width = 0;
    let offset = 0;
    switch (align) {
      case BaseFont.ALIGN.left: {
        haveWidth += padding;
        ColsIterator.getInstance()
          .setBegin(ci)
          .setEnd(cols.len)
          .setLoop((i) => {
            const colWidth = cols.getWidth(i);
            width += colWidth;
            return haveWidth > width;
          })
          .execute();
        break;
      }
      case BaseFont.ALIGN.center: {
        const target = haveWidth - rect.width;
        const half = target / 2;
        let leftWidth = 0;
        ColsIterator.getInstance()
          .setBegin(ci)
          .setEnd(cols.len)
          .setLoop((i) => {
            const colWidth = cols.getWidth(i);
            leftWidth += colWidth;
            return half + rect.width > leftWidth;
          })
          .execute();
        let rightWidth = 0;
        ColsIterator.getInstance()
          .setBegin(ci)
          .setEnd(0)
          .setLoop((i) => {
            const colWidth = cols.getWidth(i);
            rightWidth += colWidth;
            return half + rect.width > rightWidth;
          })
          .execute();
        width = leftWidth + rightWidth - rect.width;
        offset = -(width / 2 - rect.width / 2);
        break;
      }
      case BaseFont.ALIGN.right: {
        haveWidth += padding;
        ColsIterator.getInstance()
          .setBegin(ci)
          .setEnd(0)
          .setLoop((i) => {
            const colWidth = cols.getWidth(i);
            width += colWidth;
            return haveWidth > width;
          })
          .execute();
        offset = -(width - rect.width);
        break;
      }
    }
    return {
      width, offset,
    };
  }

}

export {
  BaseCellsHelper,
};
