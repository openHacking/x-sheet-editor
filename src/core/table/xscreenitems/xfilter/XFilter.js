import { XSelectItem } from '../xselect/XSelectItem';
import { PlainUtils } from '../../../../utils/PlainUtils';
import { RectRange } from '../../tablebase/RectRange';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { XEvent } from '../../../../lib/XEvent';
import { ColsIterator } from '../../iterator/ColsIterator';
import { RowsIterator } from '../../iterator/RowsIterator';
import { Alert } from '../../../../component/alert/Alert';
import { XScreenCssBorderItem } from '../../xscreen/item/viewborder/XScreenCssBorderItem';
import darkFilter from '../../../../../assets/svg/filter-dark.svg';
import { XTableMousePointer } from '../../XTableMousePointer';
import { XIcon } from '../../xicon/XIcon';

class XFilter extends XScreenCssBorderItem {

  constructor(table) {
    super({ table });
    this.display = false;
    this.buttons = [];
    this.icons = [];
    this.selectRange = null;
    this.flt = new Widget(`${cssPrefix}-x-filter ${cssPrefix}-x-filter-lt`);
    this.ft = new Widget(`${cssPrefix}-x-filter ${cssPrefix}-x-filter-t`);
    this.fbr = new Widget(`${cssPrefix}-x-filter ${cssPrefix}-x-filter-br`);
    this.fl = new Widget(`${cssPrefix}-x-filter ${cssPrefix}-x-filter-l`);
    this.blt.children(this.flt);
    this.bl.children(this.fl);
    this.bt.children(this.ft);
    this.bbr.children(this.fbr);
    this.setBorderColor('#0071cf');
    this.bind();
  }

  borderHandle() {
    const { selectRange, display } = this;
    if (selectRange && display) {
      this.hideBorder();
      this.showBorder(selectRange);
    }
  }

  offsetHandle() {
    const { selectRange } = this;
    if (selectRange) {
      this.setDisplay(selectRange);
      this.setSizer(selectRange);
      this.setLocal(selectRange);
    }
  }

  xFilterHandle() {
    const { table } = this;
    const {
      xScreen, cols, rows,
    } = table;

    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    const cells = table.getTableCells();
    const merges = table.getTableMerges();

    if (selectRange) {
      let targetRange = selectRange.clone();
      const { sri, sci, eri, eci } = targetRange;
      const rowLen = rows.len - 1;
      const colLen = cols.len - 1;
      const merge = merges.getFirstIncludes(sri, sci) || RectRange.EMPTY;
      // 排除多选单元格
      if (targetRange.multiple() && !merge.equals(targetRange)) {
        this.selectRange = targetRange;
        return;
      }
      // 向右走
      ColsIterator.getInstance()
        .setBegin(eci + 1)
        .setEnd(colLen)
        .setLoop((i) => {
          const cell = cells.getCellOrMergeCell(sri, i);
          if (PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text)) {
            return false;
          }
          targetRange = targetRange.union(new RectRange(sri, i, sri, i));
          return true;
        })
        .execute();
      // 向左走
      ColsIterator.getInstance()
        .setBegin(sci - 1)
        .setEnd(0)
        .setLoop((i) => {
          const cell = cells.getCellOrMergeCell(sri, i);
          if (PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text)) {
            return false;
          }
          targetRange = targetRange.union(new RectRange(sri, i, sri, i));
          return true;
        })
        .execute();
      // 向下走
      RowsIterator.getInstance()
        .setBegin(eri + 1)
        .setEnd(rowLen)
        .setLoop((i) => {
          const cell = cells.getCellOrMergeCell(i, sci);
          if (PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text)) {
            return false;
          }
          targetRange = targetRange.union(new RectRange(i, sci, i, sci));
          return true;
        })
        .execute();
      // 向上走
      RowsIterator.getInstance()
        .setBegin(sri - 1)
        .setEnd(0)
        .setLoop((i) => {
          const cell = cells.getCellOrMergeCell(i, sci);
          if (PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text)) {
            return false;
          }
          targetRange = targetRange.union(new RectRange(i, sci, i, sci));
          return true;
        })
        .execute();
      // 向右扫描
      ColsIterator.getInstance()
        .setBegin(targetRange.eci + 1)
        .setEnd(colLen)
        .setLoop((i) => {
          const { sri, eri } = targetRange;
          let emptyCol = true;
          RowsIterator.getInstance()
            .setBegin(sri)
            .setEnd(eri)
            .setLoop((j) => {
              const cell = cells.getCellOrMergeCell(j, i);
              if (!PlainUtils.isUnDef(cell) && !PlainUtils.isBlank(cell.text)) {
                targetRange = targetRange.union(new RectRange(j, i, j, i));
                emptyCol = false;
              }
            })
            .execute();
          return !emptyCol;
        })
        .execute();
      // 向左扫描
      ColsIterator.getInstance()
        .setBegin(targetRange.sci - 1)
        .setEnd(0)
        .setLoop((i) => {
          const { sri, eri } = targetRange;
          let emptyCol = true;
          RowsIterator.getInstance()
            .setBegin(sri)
            .setEnd(eri)
            .setLoop((j) => {
              const cell = cells.getCellOrMergeCell(j, i);
              if (!PlainUtils.isUnDef(cell) && !PlainUtils.isBlank(cell.text)) {
                targetRange = targetRange.union(new RectRange(j, i, j, i));
                emptyCol = false;
              }
            })
            .execute();
          return !emptyCol;
        })
        .execute();
      // 向下扫描
      RowsIterator.getInstance()
        .setBegin(targetRange.eri + 1)
        .setEnd(rowLen)
        .setLoop((i) => {
          const { sci, eci } = targetRange;
          let emptyRow = true;
          ColsIterator.getInstance()
            .setBegin(sci)
            .setEnd(eci)
            .setLoop((j) => {
              const cell = cells.getCellOrMergeCell(i, j);
              if (!PlainUtils.isUnDef(cell) && !PlainUtils.isBlank(cell.text)) {
                targetRange = targetRange.union(new RectRange(i, j, i, j));
                emptyRow = false;
              }
            })
            .execute();
          return !emptyRow;
        })
        .execute();
      // 向上扫描
      RowsIterator.getInstance()
        .setBegin(targetRange.sri - 1)
        .setEnd(0)
        .setLoop((i) => {
          const { sci, eci } = targetRange;
          let emptyRow = true;
          ColsIterator.getInstance()
            .setBegin(sci)
            .setEnd(eci)
            .setLoop((j) => {
              const cell = cells.getCellOrMergeCell(i, j);
              if (!PlainUtils.isUnDef(cell) && !PlainUtils.isBlank(cell.text)) {
                targetRange = targetRange.union(new RectRange(i, j, i, j));
                emptyRow = false;
              }
            })
            .execute();
          return !emptyRow;
        })
        .execute();
      this.selectRange = targetRange;

    } else {
      this.selectRange = null;
    }
  }

  xFilterOffset() {
    this.offsetHandle();
    this.borderHandle();
  }

  clearIcon() {
    const { table, selectRange } = this;
    if (selectRange) {
      const style = table.getXTableStyle();
      const { fixedCellIcon } = style;
      this.icons.forEach((item) => {
        const { ri, ci, icon } = item;
        fixedCellIcon.remove(ri, ci, icon);
      });
      this.icons = [];
      table.render();
    }
  }

  createIcon() {
    const { table, selectRange } = this;
    if (selectRange) {
      const { top } = selectRange.brink();
      const style = table.getXTableStyle();
      const { mousePointer } = table;
      const { fixedCellIcon } = style;
      top.each((ri, ci) => {
        const icon = new XIcon({
          image: darkFilter,
          offset: {
            x: -2,
            y: -2,
          },
          height: 18,
          width: 18,
          vertical: XIcon.ICON_VERTICAL.BOTTOM,
          onDown: () => {},
          onLeave: () => {
            mousePointer.free(XFilter);
          },
          onMove: () => {
            mousePointer.set(XTableMousePointer.KEYS.pointer, XFilter);
          },
        });
        fixedCellIcon.add(ri, ci, icon);
        this.icons.push({
          ri, ci, icon,
        });
      });
      table.render();
    }
  }

  onAdd() {
    super.onAdd();
  }

  unbind() {
    const { table } = this;
    XEvent.unbind(table);
  }

  bind() {
    const { table } = this;
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE, () => {
      if (this.display) {
        this.xFilterOffset();
      }
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      if (this.display) {
        this.xFilterOffset();
      }
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.RENDER, () => {
      if (this.display) {
        this.xFilterOffset();
      }
    });
  }

  openFilter() {
    const { table } = this;
    const cells = table.getTableCells();
    this.xFilterHandle();
    const { selectRange } = this;
    if (selectRange) {
      if (cells.emptyRectRange(selectRange)) {
        new Alert({
          message: '不能为空数据区创建过滤器, 请选择非空区域',
        }).open();
      } else {
        this.display = true;
        this.createIcon();
        this.show();
        this.xFilterOffset();
      }
    }
  }

  hideFilter() {
    this.display = false;
    this.clearIcon();
    this.hide();
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  XFilter,
};
