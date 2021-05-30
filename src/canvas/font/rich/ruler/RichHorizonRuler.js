import { RichRuler } from '../RichRuler';
import { BaseRuler } from '../../BaseRuler';
import { PlainUtils } from '../../../../utils/PlainUtils';

class RichHorizonRuler extends RichRuler {

  constructor({
    draw, rich, rect, overflow,
    name, size, color, bold, italic, padding, textWrap,
    lineHeight = 8, spacing = 6,
  }) {
    super({
      rich, draw,
    });
    this.rect = rect;
    this.overflow = overflow;
    this.name = name;
    this.size = size;
    this.color = color;
    this.bold = bold;
    this.italic = italic;
    this.padding = padding;
    this.textWrap = textWrap;
    this.lineHeight = lineHeight;
    this.spacing = spacing;
    this.used = BaseRuler.USED.DEFAULT_INI;

    // 裁剪文本
    this.truncateText = []; // [[x,y],[x,y],....]
    this.truncateTextWidth = 0;
    this.truncateTextHeight = 0;

    // 溢出文本
    this.overflowText = []; // [[x,y],[x,y],....]
    this.overflowTextWidth = 0;
    this.overflowTextHeight = 0;

    // 自动换行文本
    this.textWrapTextArray = []; // [[x,y],[x,y],....]
    this.textWrapTextHeight = 0;
  }

  truncateRuler() {
    if (this.used) { return; }
    const { size, color, name, bold, italic } = this;
    const { spacing } = this;
    const { draw, rich } = this;
    const textArray = [];
    draw.save();
    let textWidth = 0;
    let textHeight = 0;
    for (let i = 0, len = rich.length; i < len; i++) {
      const item = rich[i];
      const attr = PlainUtils.copy({}, {
        size, name, bold, italic, color,
      }, item);
      const fontItalic = `${attr.italic ? 'italic' : ''}`;
      const fontBold = `${attr.bold ? 'bold' : ''}`;
      const fontSize = `${attr.size}px`;
      const fontName = `${attr.name}`;
      const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
      draw.attr({
        font: fontStyle.trim(),
        fillStyle: attr.color,
        strokeStyle: attr.color,
      });
      const {
        width, height, ascent,
      } = this.textSize(attr.text);
      textArray.push({
        x: textWidth,
        y: 0,
        width,
        height,
        ascent,
      });
      if (textHeight < height) {
        textHeight = height;
      }
      textWidth += width + spacing;
    }
    draw.restore();
    if (textWidth > 0) {
      textWidth -= spacing;
    }
    this.truncateText = textArray;
    this.truncateTextWidth = textWidth;
    this.truncateTextHeight = textHeight;
    this.used = BaseRuler.USED.TRUNCATE;
  }

  overflowRuler() {
    if (this.used) { return; }
    const { size, color, name, bold, italic } = this;
    const { spacing } = this;
    const { draw, rich } = this;
    const textArray = [];
    draw.save();
    let textWidth = 0;
    let textHeight = 0;
    for (let i = 0, len = rich.length; i < len; i++) {
      const item = rich[i];
      const attr = PlainUtils.copy({}, {
        size, name, bold, italic, color,
      }, item);
      const fontItalic = `${attr.italic ? 'italic' : ''}`;
      const fontBold = `${attr.bold ? 'bold' : ''}`;
      const fontSize = `${attr.size}px`;
      const fontName = `${attr.name}`;
      const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
      draw.attr({
        font: fontStyle.trim(),
        fillStyle: attr.color,
        strokeStyle: attr.color,
      });
      const {
        width, height, ascent,
      } = this.textSize(attr.text);
      textArray.push({
        x: textWidth,
        y: 0,
        width,
        height,
        ascent,
      });
      if (textHeight < height) {
        textHeight = height;
      }
      textWidth += width + spacing;
    }
    draw.restore();
    if (textWidth > 0) {
      textWidth -= spacing;
    }
    this.overflowText = textArray;
    this.overflowTextWidth = textWidth;
    this.overflowTextHeight = textHeight;
    this.used = BaseRuler.USED.OVER_FLOW;
  }

  textWrapRuler() {

  }

}

export {
  RichHorizonRuler,
};
