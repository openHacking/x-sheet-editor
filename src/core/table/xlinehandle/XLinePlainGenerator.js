import { XLineIteratorLoop } from './XLineIteratorLoop';
import { PlainUtils } from '../../../utils/PlainUtils';
import { LineGrid } from './linegrids/LineGrid';
import { LineBorder, MergeBorder } from './lineborder/LineBorder';
import { Rect } from '../../../canvas/Rect';

class XLineMergeGenerator {

  constructor({
    merges, rows, cols, scrollView,
  }) {
    this.scrollView = scrollView;
    this.rows = rows;
    this.cols = cols;
    this.merges = merges;
    this.filter = [];
    this.mLine = [];
  }

  hasMerge({
    merge,
  }) {
    if (PlainUtils.isUnDef(merge)) {
      return true;
    }
    const { filter } = this;
    return filter.find(i => i.merge === merge);
  }

  addMerge({
    row, col, x, y,
  }) {
    const { merges } = this;
    const merge = merges.getFirstIncludes(row, col);
    if (this.hasMerge(merge)) {
      return;
    }
    const { rows, cols, scrollView } = this;
    const width = cols.rectRangeSumWidth(merge);
    const height = rows.rectRangeSumHeight(merge);
    const view = scrollView.coincide(merge);
    const rect = new Rect({ x, y, width, height });
    this.filter.push({ merge, rect, view });
  }

  mergeBrink() {
    const { cols, rows, filter } = this;
    const result = [];
    for (let i = 0; i < filter.length; i += 1) {
      const { view, rect, merge } = filter[i];
      const brink = view.brink();
      const top = {
        view: brink.top,
        x: rect.x,
        y: rect.y,
      };
      const left = {
        view: brink.left,
        x: rect.x,
        y: rect.y,
      };
      const bottom = {
        view: brink.bottom,
        x: rect.x,
        y: rect.y + rect.height - rows.rectRangeSumHeight(brink.bottom),
      };
      const right = {
        view: brink.right,
        x: rect.x + rect.width - cols.rectRangeSumWidth(brink.right),
        y: rect.y,
      };
      const item = {};
      if (merge.sri === view.sri) {
        item.top = top;
      }
      if (merge.sci === view.sci) {
        item.left = left;
      }
      if (merge.eri === view.eri) {
        item.bottom = bottom;
      }
      if (merge.eci === view.eci) {
        item.right = right;
      }
      result.push(item);
    }
    return result;
  }

  run() {
    const { rows, cols, cells, foldOnOff, mLine } = this;
    const brink = this.mergeBrink();
    for (let idx = 0; idx < brink.length; idx++) {
      const { x: bx, y: by, view } = brink[idx];
      const bLine = new MergeBorder({
        rows, cols, cells, bx, by,
      });
      const xIterator = new XLineIteratorLoop({
        items: bLine.getItems(),
        rows,
        cols,
        view,
        foldOnOff,
      });
      xIterator.run();
      mLine.push(bLine.getResult());
    }
  }

  getResult() {
    return this.mLine;
  }

}

class XLinePlainGenerator {

  run({
    scrollView,
    foldOnOff,
    rows,
    cols,
    cells,
    bx,
    by,
    getWidth,
    getHeight,
    merges,
  }) {
    const bLine = new LineBorder({
      rows, cols, cells, bx, by,
    });
    const gLine = new LineGrid({
      bx, by, getWidth, getHeight,
    });
    const generator = new XLineMergeGenerator({
      merges, rows, cols, scrollView,
    });
    const xIterator = new XLineIteratorLoop({
      items: bLine.getItems().concat(gLine.getItems()),
      foldOnOff,
      rows,
      cols,
      view: scrollView,
      cellLoop: (row, col, x, y) => {
        generator.addMerge({ row, col, x, y });
      },
    });
    xIterator.run();
    generator.run();
    const mResult = generator.getResult();
    const gResult = gLine.getResult();
    const bResult = bLine.getResult();
    return gResult.concat(bResult).concat(mResult);
  }

}

export {
  XLinePlainGenerator,
};
