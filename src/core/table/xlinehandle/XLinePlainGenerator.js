import { XLineIteratorLoop } from './XLineIteratorLoop';
import { LineGrid } from './linegrids/LineGrid';
import { LineBorder } from './lineborder/LineBorder';
import { AngleBar } from './anglebar/AngleBar';

class XLinePlainGenerator {

  static run({
    optimize = true,
    scrollView,
    foldOnOff,
    merges,
    by = 0,
    bx = 0,
    rows,
    cols,
    cells,
    getHeight = ri => rows.getHeight(ri),
    getWidth = ci => cols.getWidth(ci),
    model = XLinePlainGenerator.MODEL.ALL,
  }) {
    switch (model) {
      case XLinePlainGenerator.MODEL.BORDER: {
        const bLine = new LineBorder({
          rows, cols, cells, merges, bx, by, optimize,
        });
        const aLine = new AngleBar({
          rows, cols, cells, merges, bx, by, optimize,
        });
        const xIterator = new XLineIteratorLoop({
          items: bLine.getItems().concat(aLine.getItems()),
          foldOnOff,
          rows,
          cols,
          view: scrollView,
        });
        xIterator.run();
        const bResult = bLine.getResult();
        const aResult = aLine.getResult();
        return {
          bResult, aResult,
        };
      }
      case XLinePlainGenerator.MODEL.ALL: {
        const bLine = new LineBorder({
          rows, cols, cells, merges, bx, by, optimize,
        });
        const gLine = new LineGrid({
          rows, cols, cells, merges, bx, by, getWidth, getHeight,
        });
        const aLine = new AngleBar({
          rows, cols, cells, merges, bx, by, optimize,
        });
        const xIterator = new XLineIteratorLoop({
          items: bLine.getItems().concat(gLine.getItems()).concat(aLine.getItems()),
          foldOnOff,
          rows,
          cols,
          view: scrollView,
        });
        xIterator.run();
        const gResult = gLine.getResult();
        const bResult = bLine.getResult();
        const aResult = aLine.getResult();
        return {
          gResult, bResult, aResult,
        };
      }
      case XLinePlainGenerator.MODEL.GRID: {
        const gLine = new LineGrid({
          rows, cols, cells, merges, bx, by, getWidth, getHeight,
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
    return null;
  }

}

XLinePlainGenerator.MODEL = {
  BORDER: 1,
  ALL: 3,
  GRID: 2,
};

export {
  XLinePlainGenerator,
};
