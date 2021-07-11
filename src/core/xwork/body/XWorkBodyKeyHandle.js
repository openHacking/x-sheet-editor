import { XSelectItem } from '../../xtable/xscreenitems/xselect/XSelectItem';

function tab({ table, body, response }) {
  const { xTableScrollView } = table;
  const { cols, rows, xScreen, edit } = table;
  const xSelect = xScreen.findType(XSelectItem);
  const merges = table.getTableMerges();
  response[9] = () => {
    edit.hideEdit();
    let scrollView = xTableScrollView.getScrollView();
    let cLen = cols.len - 1;
    let rLen = rows.len - 1;
    let { masterRow, selectRange } = xSelect;
    let clone = selectRange.clone();
    let { sri, sci } = clone;
    // 当前区域是否是合并单元格
    let merge = merges.getFirstIncludes(sri, sci);
    if (merge) {
      sci = merge.eci;
    }
    if (sri >= rLen) {
      if (sci >= cLen) {
        return;
      }
    }
    if (sci >= cLen) {
      sri += 1;
      sci = 0;
    } else {
      sri = masterRow;
      sci += 1;
    }
    clone.sri = sri;
    clone.sci = sci;
    clone.eri = sri;
    clone.eci = sci;
    // 目标区域是否是合并单元格
    merge = merges.getFirstIncludes(sri, sci);
    if (merge) {
      xSelect.setRange(merge);
    } else {
      xSelect.setRange(clone);
    }
    // 是否超过视图区域
    let minCi = scrollView.sci;
    let minRi = scrollView.sri;
    let maxCi = scrollView.eci - 1;
    let maxRi = scrollView.eri - 1;
    if (sci > maxCi) {
      let diff = sci - maxCi;
      let next = scrollView.sci + diff;
      table.scrollCi(next);
      body.scrollBarSize();
      body.scrollBarLocal();
    }
    if (sri > maxRi) {
      let diff = sri - maxRi;
      let next = scrollView.sri + diff;
      table.scrollRi(next);
      body.scrollBarSize();
      body.scrollBarLocal();
    }
    if (sci < minCi) {
      let diff = minCi - sci;
      let last = scrollView.sci - diff;
      table.scrollCi(last);
      body.scrollBarSize();
      body.scrollBarLocal();
    }
    if (sri < minRi) {
      let diff = minRi - sri;
      let last = scrollView.sri - diff;
      table.scrollRi(last);
      body.scrollBarSize();
      body.scrollBarLocal();
    }
    edit.showEdit();
  };
}

function controlC({ table, body, response }) {
  response[67] = () => {};
}

function controlV({ table, body, response }) {
  response[86] = () => {};
}

function pageUp({ table, body, response }) {
  const { xTableScrollView } = table;
  response[33] = () => {
    let scrollView = xTableScrollView.getScrollView();
    let { eri, sri } = scrollView;
    let curDiff = eri - sri;
    let value = sri - curDiff;
    let minDiff = 0;
    let scroll = value <= minDiff ? minDiff : value;
    table.scrollRi(scroll);
    body.scrollBarSize();
    body.scrollBarLocal();
  };
}

function pageDown({ table, body, response }) {
  const { xTableScrollView } = table;
  response[34] = () => {
    let scrollView = xTableScrollView.getScrollView();
    let { maxRi } = xTableScrollView.getScrollMaxRiCi();
    let { eri, sri } = scrollView;
    let curDiff = eri - sri;
    let value = sri + curDiff;
    let scroll = value > maxRi ? maxRi : value;
    table.scrollRi(scroll);
    body.scrollBarSize();
    body.scrollBarLocal();
  };
}

function arrowUp({ table, body, response }) {
  const { xScreen, xTableScrollView } = table;
  const merges = table.getTableMerges();
  const xSelect = xScreen.findType(XSelectItem);
  response[38] = () => {
    let scrollView = xTableScrollView.getScrollView();
    let { masterCol, selectRange } = xSelect;
    let clone = selectRange.clone();
    let { sri, sci } = clone;
    sri -= 1;
    // 是否超过最小行数
    if (sri < 0) {
      return;
    }
    clone.sci = masterCol;
    clone.eci = masterCol;
    clone.sri = sri;
    clone.eri = sri;
    // 目标区域是否是合并单元格
    let merge = merges.getFirstIncludes(sri, sci);
    if (merge) {
      xSelect.setRange(merge);
    } else {
      xSelect.setRange(clone);
    }
    // 是否超过视图区域
    let minRi = scrollView.sri;
    if (sri < minRi) {
      let diff = minRi - sri;
      let last = scrollView.sri - diff;
      table.scrollRi(last);
      body.scrollBarSize();
      body.scrollBarLocal();
    }
  };
}

function arrowDown({ table, body, response }) {
  const { xTableScrollView } = table;
  const { rows, xScreen } = table;
  const merges = table.getTableMerges();
  const xSelect = xScreen.findType(XSelectItem);
  response[40] = () => {
    let scrollView = xTableScrollView.getScrollView();
    let { masterCol, selectRange } = xSelect;
    let rLen = rows.len - 1;
    let clone = selectRange.clone();
    let { sri, sci } = clone;
    // 当前区域是否是合并单元格
    let merge = merges.getFirstIncludes(sri, sci);
    if (merge) {
      sri = merge.eri;
    }
    sri += 1;
    // 是否超过最大行数
    if (sri > rLen) {
      return;
    }
    clone.sci = masterCol;
    clone.eci = masterCol;
    clone.sri = sri;
    clone.eri = sri;
    // 目标区域是否是合并单元格
    merge = merges.getFirstIncludes(sri, sci);
    if (merge) {
      xSelect.setRange(merge);
    } else {
      xSelect.setRange(clone);
    }
    // 是否超过视图区域
    let maxRi = scrollView.eri - 1;
    if (sri > maxRi) {
      let diff = sri - maxRi;
      let next = scrollView.sri + diff;
      table.scrollRi(next);
      body.scrollBarSize();
      body.scrollBarLocal();
    }
  };
}

function arrowLeft({ table, body, response }) {
  const { xScreen, xTableScrollView } = table;
  const merges = table.getTableMerges();
  const xSelect = xScreen.findType(XSelectItem);
  response[37] = () => {
    let scrollView = xTableScrollView.getScrollView();
    let { masterRow, selectRange } = xSelect;
    let clone = selectRange.clone();
    let { sci, sri } = clone;
    sci -= 1;
    // 是否超过最小列数
    if (sci < 0) {
      return;
    }
    clone.sri = masterRow;
    clone.eri = masterRow;
    clone.sci = sci;
    clone.eci = sci;
    // 目标区域是否是合并单元格
    let merge = merges.getFirstIncludes(sri, sci);
    if (merge) {
      xSelect.setRange(merge);
    } else {
      xSelect.setRange(clone);
    }
    // 是否超过视图区域
    let minCi = scrollView.sci;
    if (sci < minCi) {
      let diff = minCi - sci;
      let last = scrollView.sci - diff;
      table.scrollCi(last);
      body.scrollBarSize();
      body.scrollBarLocal();
    }
  };
}

function arrowRight({ table, body, response }) {
  const { cols, xScreen } = table;
  const { xTableScrollView } = table;
  const merges = table.getTableMerges();
  const xSelect = xScreen.findType(XSelectItem);
  response[39] = () => {
    let scrollView = xTableScrollView.getScrollView();
    let { masterRow, selectRange } = xSelect;
    let clone = selectRange.clone();
    let cLen = cols.len - 1;
    let { sci, sri } = clone;
    // 当前区域是否是合并单元格
    let merge = merges.getFirstIncludes(sri, sci);
    if (merge) {
      sci = merge.eci;
    }
    sci += 1;
    // 是否超过最大列数
    if (sci > cLen) {
      return;
    }
    clone.sri = masterRow;
    clone.eri = masterRow;
    clone.sci = sci;
    clone.eci = sci;
    // 目标区域是否是合并单元格
    merge = merges.getFirstIncludes(sri, sci);
    if (merge) {
      xSelect.setRange(merge);
    } else {
      xSelect.setRange(clone);
    }
    // 是否超过视图区域
    let maxCi = scrollView.eci - 1;
    if (sci > maxCi) {
      let diff = sci - maxCi;
      let next = scrollView.sci + diff;
      table.scrollCi(next);
      body.scrollBarSize();
      body.scrollBarLocal();
    }
  };
}

class XWorkBodyKeyHandle {

  static register({
    table, body,
  }) {
    const { keyboard } = table;
    const response = {};
    tab({ table, body, response });
    controlC({ table, body, response });
    controlV({ table, body, response });
    pageUp({ table, body, response });
    pageDown({ table, body, response });
    arrowLeft({ table, body, response });
    arrowUp({ table, body, response });
    arrowDown({ table, body, response });
    arrowRight({ table, body, response });
    keyboard.register({
      target: table, response,
    });
  }

}

export {
  XWorkBodyKeyHandle,
};
