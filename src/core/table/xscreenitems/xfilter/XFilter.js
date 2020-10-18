import { XSelectItem } from '../xselect/XSelectItem';
import { PlainUtils } from '../../../../utils/PlainUtils';
import { RectRange } from '../../tablebase/RectRange';
import { XFilterButton } from './XFilterButton';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { XEvent } from '../../../../lib/XEvent';
import { RANGE_OVER_GO } from '../../xscreen/item/viewborder/XScreenStyleBorderItem';
import { ColsIterator } from '../../iterator/ColsIterator';
import { RowsIterator } from '../../iterator/RowsIterator';
import { Alert } from '../../../../component/alert/Alert';
import { XScreenCssBorderItem } from '../../xscreen/item/viewborder/XScreenCssBorderItem';

class XFilter extends XScreenCssBorderItem {

  constructor(table) {
    super({ table });
    this.display = false;
    this.buttons = [];
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

  filterRangeHandle() {
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

  offsetHandle() {
    const { selectRange } = this;
    if (selectRange) {
      this.setDisplay(selectRange);
      this.setSizer(selectRange);
      this.setLocal(selectRange);
    }
  }

  borderHandle() {
    const { selectRange, display } = this;
    if (selectRange && display) {
      this.hideBorder();
      this.showBorder(selectRange);
    }
  }

  bind() {
    const { table } = this;
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE, () => {
      if (this.display) {
        this.updateFilterButton();
      }
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      if (this.display) {
        this.updateFilterButton();
      }
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.RENDER, () => {
      if (this.display) {
        this.updateFilterButton();
      }
    });
  }

  onAdd() {
    super.onAdd();
  }

  filterButtonHandle() {
    const {
      table, selectRange,
    } = this;
    if (selectRange) {
      const {
        xFixedView, cols, rows, xScreen,
      } = table;

      const targetRange = selectRange.brink().top;
      const fixedView = xFixedView.getFixedView();
      const scrollView = table.getScrollView();
      const {
        sri: fSri, sci: fSci, eri: fEri, eci: fEci,
      } = fixedView;
      const {
        sri: sSri, sci: sSci, eri: sEri, eci: sEci,
      } = scrollView;

      this.buttons.forEach((item) => {
        item.destroy();
      });

      const br = scrollView.coincide(targetRange);
      const buttons = [];
      const {
        flt, ft, fbr, fl,
      } = this;
      let lt = RectRange.EMPTY;
      let t = RectRange.EMPTY;
      let l = RectRange.EMPTY;
      if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
        const xSelect = xScreen.findType(XSelectItem);
        const overGo = xSelect.getOverGo(targetRange);
        lt = fixedView.coincide(targetRange);
        t = new RectRange(fSri, sSci, fEri, sEci).coincide(targetRange);
        l = new RectRange(sSri, fSci, sEri, fEci).coincide(targetRange);
        switch (overGo) {
          case RANGE_OVER_GO.ALL:
          case RANGE_OVER_GO.LT:
          case RANGE_OVER_GO.T:
          case RANGE_OVER_GO.LTT:
          case RANGE_OVER_GO.LTL:
          case RANGE_OVER_GO.BRT:
            if (!lt.equals(RectRange.EMPTY)) {
              const { top } = lt.brink();
              const height = rows.getHeight(top.sri);
              let left = 0;
              ColsIterator.getInstance()
                .setBegin(top.sci)
                .setEnd(top.eci)
                .setLoop((i) => {
                  const width = cols.getWidth(i);
                  const button = new XFilterButton({
                    ri: top.sri,
                    ci: i,
                    xFilter: this,
                    area: flt,
                  });
                  button.setSize(left, width, height);
                  flt.children(button);
                  buttons.push(button);
                  left += width;
                })
                .execute();
            }
            if (!t.equals(RectRange.EMPTY)) {
              const { top } = t.brink();
              const height = rows.getHeight(top.sri);
              let left = 0;
              ColsIterator.getInstance()
                .setBegin(top.sci)
                .setEnd(top.eci)
                .setLoop((i) => {
                  const width = cols.getWidth(i);
                  const button = new XFilterButton({
                    ri: top.sri,
                    ci: i,
                    xFilter: this,
                    area: ft,
                  });
                  button.setSize(left, width, height);
                  ft.children(button);
                  buttons.push(button);
                  left += width;
                })
                .execute();
            }
            break;
          case RANGE_OVER_GO.L:
          case RANGE_OVER_GO.BR:
          case RANGE_OVER_GO.BRL:
            if (!l.equals(RectRange.EMPTY)) {
              const { top } = l.brink();
              const height = rows.getHeight(top.sri);
              let left = 0;
              ColsIterator.getInstance()
                .setBegin(top.sci)
                .setEnd(top.eci)
                .setLoop((i) => {
                  const width = cols.getWidth(i);
                  const button = new XFilterButton({
                    ri: top.sri,
                    ci: i,
                    xFilter: this,
                    area: fl,
                  });
                  button.setSize(left, width, height);
                  fl.children(button);
                  buttons.push(button);
                  left += width;
                })
                .execute();
            }
            if (!br.equals(RectRange.EMPTY)) {
              const { top } = br.brink();
              const height = rows.getHeight(top.sri);
              let left = 0;
              ColsIterator.getInstance()
                .setBegin(top.sci)
                .setEnd(top.eci)
                .setLoop((i) => {
                  const width = cols.getWidth(i);
                  const button = new XFilterButton({
                    ri: top.sri,
                    ci: i,
                    xFilter: this,
                    area: fbr,
                  });
                  button.setSize(left, width, height);
                  fbr.children(button);
                  buttons.push(button);
                  left += width;
                })
                .execute();
            }
        }
        this.buttons = buttons;
        return;
      }
      if (xFixedView.hasFixedTop()) {
        t = new RectRange(fSri, sSci, fEri, sEci).coincide(targetRange);
        if (!t.equals(RectRange.EMPTY)) {
          const { top } = t.brink();
          const height = rows.getHeight(top.sri);
          let left = 0;
          ColsIterator.getInstance()
            .setBegin(top.sci)
            .setEnd(top.eci)
            .setLoop((i) => {
              const width = cols.getWidth(i);
              const button = new XFilterButton({
                ri: top.sri,
                ci: i,
                xFilter: this,
                area: ft,
              });
              button.setSize(left, width, height);
              ft.children(button);
              buttons.push(button);
              left += width;
            })
            .execute();
        }
        this.buttons = buttons;
        return;
      }
      if (xFixedView.hasFixedLeft()) {
        l = new RectRange(sSri, fSci, sEri, fEci).coincide(targetRange);
        if (!l.equals(RectRange.EMPTY)) {
          const { top } = l.brink();
          const height = rows.getHeight(top.sri);
          let left = 0;
          ColsIterator.getInstance()
            .setBegin(top.sci)
            .setEnd(top.eci)
            .setLoop((i) => {
              const width = cols.getWidth(i);
              const button = new XFilterButton({
                ri: top.sri,
                ci: i,
                xFilter: this,
                area: fl,
              });
              button.setSize(left, width, height);
              fl.children(button);
              buttons.push(button);
              left += width;
            })
            .execute();
        }
        if (!br.equals(RectRange.EMPTY)) {
          const { top } = br.brink();
          const height = rows.getHeight(top.sri);
          let left = 0;
          ColsIterator.getInstance()
            .setBegin(top.sci)
            .setEnd(top.eci)
            .setLoop((i) => {
              const width = cols.getWidth(i);
              const button = new XFilterButton({
                ri: top.sri,
                ci: i,
                xFilter: this,
                area: fbr,
              });
              button.setSize(left, width, height);
              fbr.children(button);
              buttons.push(button);
              left += width;
            })
            .execute();
        }
        this.buttons = buttons;
        return;
      }
      if (!br.equals(RectRange.EMPTY)) {
        const { top } = br.brink();
        const height = rows.getHeight(top.sri);
        let left = 0;
        ColsIterator.getInstance()
          .setBegin(top.sci)
          .setEnd(top.eci)
          .setLoop((i) => {
            const width = cols.getWidth(i);
            const button = new XFilterButton({
              ri: top.sri,
              ci: i,
              xFilter: this,
              area: fbr,
            });
            button.setSize(left, width, height);
            fbr.children(button);
            buttons.push(button);
            left += width;
          })
          .execute();
      }

      this.buttons = buttons;
    }
  }

  openFilterButton() {
    const { table } = this;
    const cells = table.getTableCells();
    this.filterRangeHandle();
    const { selectRange } = this;
    if (selectRange) {
      if (cells.emptyRectRange(selectRange)) {
        new Alert({
          message: '不能为空数据区创建过滤器, 请选择非空区域',
        }).open();
      } else {
        this.display = true;
        this.show();
        this.updateFilterButton();
      }
    }
  }

  hideFilterButton() {
    this.display = false;
    this.hide();
  }

  updateFilterButton() {
    this.offsetHandle();
    this.borderHandle();
    this.filterButtonHandle();
  }

}

export {
  XFilter,
};
