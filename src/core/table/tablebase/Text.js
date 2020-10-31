import { ScaleAdapter } from './Scale';
import { BaseFont } from '../../../canvas/font/BaseFont';
import { XDraw } from '../../../canvas/XDraw';
import { XFont } from '../../../canvas/font/XFont';
import { ColsIterator } from '../iterator/ColsIterator';
import { Rect } from '../../../canvas/Rect';

class TextBuilder {

  constructor({
    scaleAdapter, cols,
  }) {
    this.scaleAdapter = scaleAdapter;
    this.cols = cols;
    this.text = null;
    this.rect = null;
    this.attr = null;
    this.dw = null;
    this.overflow = null;
    this.row = -1;
    this.col = -1;
    this.merge = null;
  }

  setText(text) {
    this.text = text;
  }

  setRect(rect) {
    this.rect = rect;
  }

  setAttr(attr) {
    this.attr = attr;
  }

  setDraw(dw) {
    this.dw = dw;
  }

  setRow(row) {
    this.row = row;
  }

  setCol(col) {
    this.col = col;
  }

  setOverFlow(overflow) {
    this.overflow = overflow;
  }

  setMerge(merge) {
    this.merge = merge;
  }

  build() {
    const { text, rect, attr, overflow, cols } = this;
    const { dw, scaleAdapter, merge, col } = this;
    let xFont;
    switch (attr.direction) {
      case BaseFont.TEXT_DIRECTION.ANGLE: {
        xFont = new XFont({
          text,
          dw,
          rect,
          attr,
          angeOverFlowHandle: (textHaveWidth) => {
            let overflow;
            if (merge) {
              overflow = rect;
            } else {
              let overFlowWidth = 0;
              let overFlowX = rect.x;
              switch (attr.align) {
                case BaseFont.ALIGN.left: {
                  ColsIterator.getInstance()
                    .setBegin(col)
                    .setEnd(cols.len)
                    .setLoop((ci) => {
                      const colWidth = cols.getWidth(ci);
                      overFlowWidth += colWidth;
                      return textHaveWidth > overFlowWidth;
                    })
                    .execute();
                  break;
                }
                case BaseFont.ALIGN.center: {
                  const target = textHaveWidth - rect.width;
                  const half = target / 2;
                  let leftWidth = 0;
                  ColsIterator.getInstance()
                    .setBegin(col)
                    .setEnd(cols.len)
                    .setLoop((ci) => {
                      const colWidth = cols.getWidth(ci);
                      leftWidth += colWidth;
                      return half + rect.width > leftWidth;
                    })
                    .execute();
                  let rightWidth = 0;
                  ColsIterator.getInstance()
                    .setBegin(col)
                    .setEnd(0)
                    .setLoop((ci) => {
                      const colWidth = cols.getWidth(ci);
                      rightWidth += colWidth;
                      return half + rect.width > rightWidth;
                    })
                    .execute();
                  overFlowWidth = leftWidth + rightWidth - rect.width;
                  overFlowX -= overFlowWidth / 2 - rect.width / 2;
                  break;
                }
                case BaseFont.ALIGN.right: {
                  ColsIterator.getInstance()
                    .setBegin(col)
                    .setEnd(0)
                    .setLoop((ci) => {
                      const colWidth = cols.getWidth(ci);
                      overFlowWidth += colWidth;
                      return textHaveWidth > overFlowWidth;
                    })
                    .execute();
                  overFlowX -= overFlowWidth - rect.width;
                  break;
                }
              }
              overflow = new Rect({
                x: overFlowX,
                y: rect.y,
                height: rect.height,
                width: overFlowWidth,
              });
            }
            return overflow;
          },
        });
        break;
      }
      case BaseFont.TEXT_DIRECTION.HORIZONTAL: {
        xFont = new XFont({
          text,
          dw,
          overflow,
          rect,
          attr,
        });
        break;
      }
      case BaseFont.TEXT_DIRECTION.VERTICAL: {
        xFont = new XFont({
          text,
          dw,
          rect,
          attr,
        });
        break;
      }
    }
    const size = XDraw.srcTransformStylePx(scaleAdapter.goto(attr.size));
    const padding = XDraw.srcTransformStylePx(scaleAdapter.goto(attr.padding));
    xFont.setSize(size);
    xFont.setPadding(padding);
    return xFont;
  }

}

class Text {

  constructor({
    scaleAdapter = new ScaleAdapter(),
    cols,
  }) {
    this.scaleAdapter = scaleAdapter;
    this.cols = cols;
  }

  getBuilder() {
    const { scaleAdapter, cols } = this;
    return new TextBuilder({
      scaleAdapter, cols,
    });
  }

}

export {
  Text,
};
