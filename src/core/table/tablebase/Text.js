import { ScaleAdapter } from './Scale';
import { XDraw } from '../../../canvas/XDraw';
import { XFontBuilder } from '../../../canvas/font/XFontBuilder';
import { BaseFont } from '../../../canvas/font/BaseFont';
import XTableFormat from '../XTableFormat';

class TextBuilder {

  constructor({
    scaleAdapter,
  }) {
    this.scaleAdapter = scaleAdapter;
    this.rect = null;
    this.dw = null;
    this.cell = null;
    this.overflow = null;
  }

  setRect(rect) {
    this.rect = rect;
  }

  setDraw(dw) {
    this.dw = dw;
  }

  setCell(cell) {
    this.cell = cell;
  }

  setOverFlow(overflow) {
    this.overflow = overflow;
  }

  build() {
    const { rect, overflow, dw, scaleAdapter, cell } = this;
    const { format, text, fontAttr } = cell;
    const size = XDraw.srcTransformStylePx(scaleAdapter.goto(fontAttr.size));
    const padding = XDraw.srcTransformStylePx(scaleAdapter.goto(fontAttr.padding));
    const builder = new XFontBuilder({
      text: XTableFormat(format, text), dw, overflow, rect, attr: fontAttr,
    });
    builder.setSize(size);
    builder.setPadding(padding);
    if (cell.isAngleBarCell()) {
      builder.setDirection(BaseFont.TEXT_DIRECTION.ANGLE_BAR);
    }
    return builder.build();
  }

}

class Text {

  constructor({
    scaleAdapter = new ScaleAdapter(),
  }) {
    this.scaleAdapter = scaleAdapter;
  }

  getBuilder() {
    const { scaleAdapter } = this;
    return new TextBuilder({
      scaleAdapter,
    });
  }

}

export {
  Text,
};
