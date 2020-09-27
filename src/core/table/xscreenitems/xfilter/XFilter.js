import { XScreenViewSizer } from '../../xscreen/item/viewdisplay/XScreenViewSizer';
import { XSelectItem } from '../xselect/XSelectItem';
import { Utils } from '../../../../utils/Utils';
import { RectRange } from '../../tablebase/RectRange';
import { XFilterButton } from './XFilterButton';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { EventBind } from '../../../../utils/EventBind';
import { RANGE_OVER_GO } from '../../xscreen/item/viewborder/XScreenStyleBorderItem';
import { XDraw } from '../../../../canvas/XDraw';

class XFilter extends XScreenViewSizer {

  constructor(table) {
    super({ table });
    this.selectRange = null;
    this.status = false;
    this.buttons = [];
    this.flt = new Widget(`${cssPrefix}-x-filter ${cssPrefix}-x-filter-lt`);
    this.ft = new Widget(`${cssPrefix}-x-filter ${cssPrefix}-x-filter-t`);
    this.fbr = new Widget(`${cssPrefix}-x-filter ${cssPrefix}-x-filter-br`);
    this.fl = new Widget(`${cssPrefix}-x-filter ${cssPrefix}-x-filter-l`);
    this.lt.children(this.flt);
    this.t.children(this.ft);
    this.br.children(this.fbr);
    this.l.children(this.fl);
    this.bind();
  }

  bind() {
    const { table } = this;
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE, () => {
      if (this.status) {
        this.updateFilterButton();
      }
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      if (this.status) {
        this.updateFilterButton();
      }
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.RENDER, () => {
      if (this.status) {
        this.updateFilterButton();
      }
    });
  }

  selectOffsetHandle() {
    const { selectRange } = this;
    if (selectRange) {
      this.setDisplay(selectRange);
      this.setSizer(selectRange);
      this.setLocal(selectRange);
    }
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
        const { top } = targetRange.brink();
        this.selectRange = top;
        return;
      }

      // 向右走
      for (let i = eci + 1; i <= colLen; i += 1) {
        const cell = cells.getCellOrMergeCell(sri, i);
        if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          break;
        }
        targetRange = targetRange.union(new RectRange(sri, i, sri, i));
      }
      // 向左走
      for (let i = sci - 1; i >= 0; i -= 1) {
        const cell = cells.getCellOrMergeCell(sri, i);
        if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          break;
        }
        targetRange = targetRange.union(new RectRange(sri, i, sri, i));
      }
      // 向下走
      for (let i = eri + 1; i <= rowLen; i += 1) {
        const cell = cells.getCellOrMergeCell(i, sci);
        if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          break;
        }
        targetRange = targetRange.union(new RectRange(i, sci, i, sci));
      }
      // 向上走
      for (let i = sri - 1; i >= 0; i -= 1) {
        const cell = cells.getCellOrMergeCell(i, sci);
        if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          break;
        }
        targetRange = targetRange.union(new RectRange(i, sci, i, sci));
      }

      // 向右扫描
      for (let i = targetRange.eci + 1; i <= colLen; i += 1) {
        const { sri, eri } = targetRange;
        let emptyCol = true;
        for (let j = sri; j <= eri; j += 1) {
          const cell = cells.getCellOrMergeCell(j, i);
          if (!Utils.isUnDef(cell) && !Utils.isBlank(cell.text)) {
            targetRange = targetRange.union(new RectRange(j, i, j, i));
            emptyCol = false;
          }
        }
        if (emptyCol) {
          break;
        }
      }
      // 向左扫描
      for (let i = targetRange.sci - 1; i >= 0; i -= 1) {
        const { sri, eri } = targetRange;
        let emptyCol = true;
        for (let j = sri; j <= eri; j += 1) {
          const cell = cells.getCellOrMergeCell(j, i);
          if (!Utils.isUnDef(cell) && !Utils.isBlank(cell.text)) {
            targetRange = targetRange.union(new RectRange(j, i, j, i));
            emptyCol = false;
          }
        }
        if (emptyCol) {
          break;
        }
      }
      // 向下扫描
      for (let i = targetRange.eri + 1; i <= rowLen; i += 1) {
        const { sci, eci } = targetRange;
        let emptyRow = true;
        for (let j = sci; j <= eci; j += 1) {
          const cell = cells.getCellOrMergeCell(i, j);
          if (!Utils.isUnDef(cell) && !Utils.isBlank(cell.text)) {
            targetRange = targetRange.union(new RectRange(i, j, i, j));
            emptyRow = false;
          }
        }
        if (emptyRow) {
          break;
        }
      }
      // 向上扫描
      for (let i = targetRange.sri - 1; i >= 0; i -= 1) {
        const { sci, eci } = targetRange;
        let emptyRow = true;
        for (let j = sci; j <= eci; j += 1) {
          const cell = cells.getCellOrMergeCell(i, j);
          if (!Utils.isUnDef(cell) && !Utils.isBlank(cell.text)) {
            targetRange = targetRange.union(new RectRange(i, j, i, j));
            emptyRow = false;
          }
        }
        if (emptyRow) {
          break;
        }
      }

      const { top } = targetRange.brink();
      this.selectRange = top;

    } else {

      this.selectRange = null;

    }
  }

  updateFilterButton() {
    this.selectOffsetHandle();
    this.filterButtonHandle();
  }

  filterButtonHandle() {
    const {
      table, selectRange,
    } = this;
    if (selectRange) {
      const {
        xFixedView, cols, rows, xScreen,
      } = table;
      const fixedView = xFixedView.getFixedView();
      const scrollView = table.getScrollView();
      const {
        sri: fSri, sci: fSci, eri: fEri, eci: fEci,
      } = fixedView;
      const {
        sri: sSri, sci: sSci, eri: sEri, eci: sEci,
      } = scrollView;
      const br = scrollView.coincide(selectRange);
      let lt = RectRange.EMPTY;
      let t = RectRange.EMPTY;
      let l = RectRange.EMPTY;
      const {
        flt, ft, fbr, fl,
      } = this;
      this.buttons.forEach((item) => {
        item.destroy();
      });
      const buttons = [];
      if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
        const xSelect = xScreen.findType(XSelectItem);
        const overGo = xSelect.getOverGo(selectRange);
        lt = fixedView.coincide(selectRange);
        t = new RectRange(fSri, sSci, fEri, sEci).coincide(selectRange);
        l = new RectRange(sSri, fSci, sEri, fEci).coincide(selectRange);
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
              for (let i = top.sci; i <= top.eci; i += 1) {
                const width = cols.getWidth(i);
                const button = new XFilterButton({
                  ri: top.sri, ci: i, xFilter: this, area: flt,
                });
                button.offset({
                  left,
                  width,
                  height,
                });
                flt.children(button);
                buttons.push(button);
                left += width;
              }
            }
            if (!t.equals(RectRange.EMPTY)) {
              const { top } = t.brink();
              const height = rows.getHeight(top.sri);
              let left = 0;
              for (let i = top.sci; i <= top.eci; i += 1) {
                const width = cols.getWidth(i);
                const button = new XFilterButton({
                  ri: top.sri, ci: i, xFilter: this, area: ft,
                });
                button.offset({
                  left,
                  width,
                  height,
                });
                ft.children(button);
                buttons.push(button);
                left += width;
              }
            }
            break;
          case RANGE_OVER_GO.L:
          case RANGE_OVER_GO.BR:
          case RANGE_OVER_GO.BRL:
            if (!l.equals(RectRange.EMPTY)) {
              const { top } = l.brink();
              const height = rows.getHeight(top.sri);
              let left = 0;
              for (let i = top.sci; i <= top.eci; i += 1) {
                const width = cols.getWidth(i);
                const button = new XFilterButton({
                  ri: top.sri, ci: i, xFilter: this, area: fl,
                });
                button.offset({ left, width, height });
                fl.children(button);
                buttons.push(button);
                left += width;
              }
            }
            if (!br.equals(RectRange.EMPTY)) {
              const { top } = br.brink();
              const height = rows.getHeight(top.sri);
              let left = 0;
              for (let i = top.sci; i <= top.eci; i += 1) {
                const width = cols.getWidth(i);
                const button = new XFilterButton({
                  ri: top.sri, ci: i, xFilter: this, area: fbr,
                });
                button.offset({ left, width, height });
                fbr.children(button);
                buttons.push(button);
                left += width;
              }
            }
        }
        this.buttons = buttons;
        return;
      }
      if (xFixedView.hasFixedTop()) {
        t = new RectRange(fSri, sSci, fEri, sEci).coincide(selectRange);
        if (!t.equals(RectRange.EMPTY)) {
          const { top } = t.brink();
          const height = rows.getHeight(top.sri);
          let left = 0;
          for (let i = top.sci; i <= top.eci; i += 1) {
            const width = cols.getWidth(i);
            const button = new XFilterButton({
              ri: top.sri, ci: i, xFilter: this, area: ft,
            });
            button.offset({ left, width, height });
            ft.children(button);
            buttons.push(button);
            left += width;
          }
        }
        this.buttons = buttons;
        return;
      }
      if (xFixedView.hasFixedLeft()) {
        l = new RectRange(sSri, fSci, sEri, fEci).coincide(selectRange);
        if (!l.equals(RectRange.EMPTY)) {
          const { top } = l.brink();
          const height = rows.getHeight(top.sri);
          let left = 0;
          for (let i = top.sci; i <= top.eci; i += 1) {
            const width = cols.getWidth(i);
            const button = new XFilterButton({
              ri: top.sri, ci: i, xFilter: this, area: fl,
            });
            button.offset({ left, width, height });
            fl.children(button);
            buttons.push(button);
            left += width;
          }
        }
        if (!br.equals(RectRange.EMPTY)) {
          const { top } = br.brink();
          const height = rows.getHeight(top.sri);
          let left = 0;
          for (let i = top.sci; i <= top.eci; i += 1) {
            const width = cols.getWidth(i);
            const button = new XFilterButton({
              ri: top.sri, ci: i, xFilter: this, area: fbr,
            });
            button.offset({ left, width, height });
            fbr.children(button);
            left += width;
          }
        }
        this.buttons = buttons;
        return;
      }
      if (!br.equals(RectRange.EMPTY)) {
        const { top } = br.brink();
        const height = rows.getHeight(top.sri);
        let left = 0;
        for (let i = top.sci; i <= top.eci; i += 1) {
          const width = cols.getWidth(i);
          const button = new XFilterButton({
            ri: top.sri, ci: i, xFilter: this, area: fbr,
          });
          button.offset({
            left,
            width: XDraw.offsetToLineInside(width),
            height: XDraw.offsetToLineInside(height),
          });
          fbr.children(button);
          buttons.push(button);
          left += width;
        }
      }
      this.buttons = buttons;
    }
  }

  openFilterButton() {
    this.filterRangeHandle();
    if (this.selectRange) {
      this.status = true;
      this.show();
      this.updateFilterButton();
    }
  }

  hideFilterButton() {
    this.status = false;
    this.selectRange = null;
    this.hide();
  }

}

export {
  XFilter,
};
