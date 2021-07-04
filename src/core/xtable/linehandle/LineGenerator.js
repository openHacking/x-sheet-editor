import { RectRange } from '../tablebase/RectRange';
import { BorderHandle } from './handle/BorderHandle';
import { GridHandle } from './handle/GridHandle';
import { LineIteratorLoop } from './LineIteratorLoop';
import { IndexHandle } from './handle/IndexHandle';
import { LOutHandle } from './handle/LOutHandle';
import { ROutHandle } from './handle/ROutHandle';
import { AngleHandle } from './handle/AngleHandle';

class LineGenerator {

  static run({
    table = null,
    by = 0,
    bx = 0,
    model = LineGenerator.MODEL.ALL,
    optimize = true,
    getHeight = ri => table.rows.getHeight(ri),
    getWidth = ci => table.cols.getWidth(ci),
    foldOnOff = null,
    scrollView = RectRange.EMPTY,
  }) {
    switch (model) {
      case LineGenerator.MODEL.ALL: {
        const bLine = new BorderHandle({
          table, bx, by, optimize,
        });
        const gLine = new GridHandle({
          table, bx, by, getWidth, getHeight,
        });
        const aLine = new AngleHandle({
          table, bx, by, optimize,
        });
        const xIterator = new LineIteratorLoop({
          items: bLine.getItems().concat(gLine.getItems()).concat(aLine.getItems()),
          foldOnOff,
          table,
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
      case LineGenerator.MODEL.INDEX: {
        const iLine = new IndexHandle({
          bx, by, getWidth, getHeight,
        });
        const xIterator = new LineIteratorLoop({
          items: iLine.getItems(),
          foldOnOff,
          table,
          view: scrollView,
        });
        xIterator.run();
        const iResult = iLine.getResult();
        return {
          iResult,
        };
      }
      case LineGenerator.MODEL.GRID: {
        const gLine = new GridHandle({
          table, bx, by, getWidth, getHeight,
        });
        const xIterator = new LineIteratorLoop({
          items: gLine.getItems(),
          foldOnOff,
          table,
          view: scrollView,
        });
        xIterator.run();
        const gResult = gLine.getResult();
        return {
          gResult,
        };
      }
      case LineGenerator.MODEL.OUT_L: {
        const bLine = new LOutHandle({
          table, bx, by,
        });
        const xIterator = new LineIteratorLoop({
          items: bLine.getItems(),
          foldOnOff,
          table,
          view: scrollView,
        });
        xIterator.run();
        const bResult = bLine.getResult();
        return {
          bResult,
        };
      }
      case LineGenerator.MODEL.OUT_R: {
        const bLine = new ROutHandle({
          table, bx, by,
        });
        const xIterator = new LineIteratorLoop({
          items: bLine.getItems(),
          foldOnOff,
          table,
          view: scrollView,
        });
        xIterator.run();
        const bResult = bLine.getResult();
        return {
          bResult,
        };
      }
      case LineGenerator.MODEL.BORDER: {
        const bLine = new BorderHandle({
          table, bx, by, optimize,
        });
        const aLine = new AngleHandle({
          table, bx, by, optimize,
        });
        const xIterator = new LineIteratorLoop({
          items: bLine.getItems().concat(aLine.getItems()),
          view: scrollView,
          table,
          foldOnOff,
        });
        xIterator.run();
        const bResult = bLine.getResult();
        const aResult = aLine.getResult();
        return {
          bResult, aResult,
        };
      }
    }
    return null;
  }

}

LineGenerator.MODEL = {
  ALL: 3,
  OUT_L: 5,
  OUT_R: 6,
  GRID: 2,
  INDEX: 4,
  BORDER: 1,
};

export {
  LineGenerator,
};
