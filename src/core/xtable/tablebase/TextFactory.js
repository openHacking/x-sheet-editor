import { ScaleAdapter } from './Scale';
import { BaseFont } from '../../../canvas/font/BaseFont';
import { DrawTextBuilder } from '../../../canvas/font/text/build/DrawTextBuilder';
import { Cell } from '../tablecell/Cell';

class TextBuilder {

  constructor({
    scaleAdapter, table,
  }) {
    this.scaleAdapter = scaleAdapter;
    this.rect = null;
    this.draw = null;
    this.cell = null;
    this.row = -1;
    this.col = -1;
    this.table = table;
    this.overflow = null;
  }

  setCol(col) {
    this.col = col;
  }

  setRow(row) {
    this.row = row;
  }

  build() {
    const { rect, overflow, row, col, cell, draw, scaleAdapter, table } = this;
    const { fontAttr, ruler } = cell;
    const { contentType } = cell;
    const formatText = cell.getFormatText();
    switch (contentType) {
      case Cell.CONTENT_TYPE.RICH_TEXT: {
        // 富文本渲染
        return null;
      }
      case Cell.CONTENT_TYPE.STRING:
      case Cell.CONTENT_TYPE.DATE:
      case Cell.CONTENT_TYPE.NUMBER: {
        const size = scaleAdapter.goto(fontAttr.size);
        const padding = scaleAdapter.goto(fontAttr.padding);
        const builder = new DrawTextBuilder({
          text: formatText, draw, overflow, rect, attr: fontAttr,
        });
        builder.setSize(size);
        builder.setPadding(padding);
        if (table.isAngleBarCell(row, col)) {
          builder.setDirection(BaseFont.TEXT_DIRECTION.ANGLE_BAR);
        }
        const buildFont = builder.buildFont();
        const buildRuler = builder.buildRuler();
        const equals = buildRuler.equals(ruler);
        const diffRuler = equals ? ruler : buildRuler;
        cell.setRuler(diffRuler);
        buildFont.setRuler(diffRuler);
        return buildFont;
      }
    }
    return null;
  }

  setRect(rect) {
    this.rect = rect;
  }

  setDraw(draw) {
    this.draw = draw;
  }

  setCell(cell) {
    this.cell = cell;
  }

  setOverFlow(overflow) {
    this.overflow = overflow;
  }

}

class TextFactory {

  constructor({
    scaleAdapter = new ScaleAdapter(),
    table,
  }) {
    this.scaleAdapter = scaleAdapter;
    this.table = table;
  }

  getBuilder() {
    const { scaleAdapter, table } = this;
    return new TextBuilder({
      scaleAdapter, table,
    });
  }

}

export { TextFactory };
