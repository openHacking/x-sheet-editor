import { XLineIteratorLoop } from './XLineIteratorLoop';
import { LineGrid } from './linegrids/LineGrid';
import { LineBorder } from './lineborder/LineBorder';

class XLinePlainGenerator {

  static runTableLine({
    showGrid = false,
    optimize = true,
    bx = 0,
    by = 0,
    scrollView,
    foldOnOff,
    rows,
    merges,
    cols,
    cells,
    getHeight = ri => rows.getHeight(ri),
    getWidth = ci => cols.getWidth(ci),
  }) {
    const bLine = new LineBorder({
      rows, cols, cells, merges, bx, by, optimize,
    });
    if (showGrid) {
      const gLine = new LineGrid({
        bx, by, rows, cols, cells, merges, getWidth, getHeight,
      });
      const xIterator = new XLineIteratorLoop({
        items: bLine.getItems().concat(gLine.getItems()),
        foldOnOff,
        rows,
        cols,
        view: scrollView,
      });
      xIterator.run();
      const gResult = gLine.getResult();
      const bResult = bLine.getResult();
      return {
        gResult, bResult,
      };
    }
    const xIterator = new XLineIteratorLoop({
      items: bLine.getItems(),
      foldOnOff,
      rows,
      cols,
      view: scrollView,
    });
    xIterator.run();
    const bResult = bLine.getResult();
    return {
      bResult,
    };
  }

  static runIndexLine({
    scrollView,
    foldOnOff,
    rows,
    merges,
    cols,
    cells,
    bx = 0,
    by = 0,
    getHeight = ri => rows.getHeight(ri),
    getWidth = ci => cols.getWidth(ci),
  }) {
    const gLine = new LineGrid({
      bx, by, rows, cols, cells, merges, getWidth, getHeight,
    });
    const xIterator = new XLineIteratorLoop({
      items: gLine.getItems(),
      foldOnOff,
      rows,
      cols,
      view: scrollView,
    });
    xIterator.run();
    const gResult = gLine.getResult();
    return {
      gResult,
    };
  }

}

export {
  XLinePlainGenerator,
};
