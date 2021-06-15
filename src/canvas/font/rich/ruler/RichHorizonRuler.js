import { BaseRuler } from '../../BaseRuler';
import { RichHorizonVisual } from './RichHorizonVisual';
import { BaseFont } from '../../BaseFont';
import { RichWrapLine } from './RichWrapLine';
import { PlainUtils } from '../../../../utils/PlainUtils';

class RichHorizonRuler extends RichHorizonVisual {

  constructor({
    draw, rich, rect, overflow,
    name, size, bold, italic, align, padding, textWrap,
    lineHeight = 8, spacing = 0,
  }) {
    super({
      draw,
      rich,
      padding,
      align,
    });
    this.rect = rect;
    this.overflow = overflow;
    this.name = name;
    this.size = size;
    this.bold = bold;
    this.italic = italic;
    this.textWrap = textWrap;
    this.spacing = spacing;
    this.lineHeight = lineHeight;
    this.used = BaseRuler.USED.DEFAULT_INI;

    // 裁剪文本
    this.truncateText = [];
    this.truncateTextWidth = 0;
    this.truncateTextHeight = 0;

    // 溢出文本
    this.overflowText = [];
    this.overflowTextWidth = 0;
    this.overflowTextHeight = 0;

    // 自动换行文本
    this.textWrapTextArray = [];
    this.textWrapTextHeight = 0;
  }

  truncateRuler() {
    if (this.used) { return; }
    const { size, name, bold, italic } = this;
    const { spacing } = this;
    const { draw, rich } = this;
    const textArray = [];
    draw.save();
    let textWidth = 0;
    let textHeight = 0;
    for (let i = 0, len = rich.length; i < len; i++) {
      const item = rich[i];
      const attr = Object.assign({
        size, name, bold, italic,
      }, item);
      const fontItalic = `${attr.italic ? 'italic' : ''}`;
      const fontBold = `${attr.bold ? 'bold' : ''}`;
      const fontSize = `${attr.size}px`;
      const fontName = `${attr.name}`;
      const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
      draw.attr({
        font: fontStyle.trim(),
      });
      const { width, height, ascent } = this.textSize(attr.text);
      textArray.push({
        x: textWidth,
        y: 0,
        style: attr,
        text: attr.text,
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
    this.setUsedType(BaseRuler.USED.TRUNCATE);
  }

  overflowRuler() {
    if (this.used) { return; }
    const { size, name, bold, italic } = this;
    const { spacing } = this;
    const { draw, rich } = this;
    const textArray = [];
    draw.save();
    let textWidth = 0;
    let textHeight = 0;
    for (let i = 0, len = rich.length; i < len; i++) {
      const item = rich[i];
      const attr = Object.assign({
        size, name, bold, italic,
      }, item);
      const fontItalic = `${attr.italic ? 'italic' : ''}`;
      const fontBold = `${attr.bold ? 'bold' : ''}`;
      const fontSize = `${attr.size}px`;
      const fontName = `${attr.name}`;
      const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
      draw.attr({
        font: fontStyle.trim(),
      });
      const { width, height, ascent } = this.textSize(attr.text);
      textArray.push({
        x: textWidth,
        y: 0,
        style: attr,
        text: attr.text,
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
    this.setUsedType(BaseRuler.USED.OVER_FLOW);
  }

  textWrapRuler() {
    if (this.used) { return; }
    const { size, name, bold, italic } = this;
    const { draw, rich, rect } = this;
    const { lineHeight, spacing } = this;
    const { width } = rect;
    const alignPadding = this.getAlignPadding();
    const maxRectWidth = width - (alignPadding * 2);
    const textArray = [];
    const wrapLine = new RichWrapLine();
    let textHeight = 0;
    let textOffset = 0;
    for (let i = 0, len = rich.length; i < len; i++) {
      const item = rich[i];
      draw.save();
      const attr = Object.assign({
        size, name, bold, italic,
      }, item);
      const fontItalic = `${attr.italic ? 'italic' : ''}`;
      const fontBold = `${attr.bold ? 'bold' : ''}`;
      const fontSize = `${attr.size}px`;
      const fontName = `${attr.name}`;
      const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
      draw.attr({
        font: fontStyle.trim(),
      });
      const breakArray = this.textBreak(attr.text);
      const breakLength = breakArray.length;
      let breakIndex = 0;
      while (breakIndex < breakLength) {
        if (breakIndex) {
          const lineItem = wrapLine.getOrNew();
          lineItem.tx = textOffset;
          lineItem.ty = textHeight;
          textArray.push({
            items: wrapLine.items,
            width: wrapLine.width,
            height: wrapLine.height,
          });
          textOffset = 0;
          textHeight += wrapLine.height + lineHeight;
          wrapLine.reset();
        }
        const text = breakArray[breakIndex];
        const textLength = text.length;
        let innerIndex = 0;
        while (innerIndex < textLength) {
          const lineItem = wrapLine.getOrNew({ style: attr });
          const measureText = lineItem.text + text.charAt(innerIndex);
          const measure = this.textSize(measureText);
          const lineWidth = textOffset + spacing + measure.width;
          if (lineWidth > maxRectWidth) {
            if (wrapLine.width === 0) {
              lineItem.tx = textOffset;
              lineItem.ty = textHeight;
              lineItem.text = measureText;
              lineItem.width = measure.width;
              lineItem.height = measure.height;
              lineItem.ascent = measure.ascent;
              wrapLine.width = measure.width;
              wrapLine.height = measure.height;
              textArray.push({
                items: wrapLine.items,
                width: wrapLine.width,
                height: wrapLine.height,
              });
              innerIndex += 1;
            } else {
              lineItem.tx = textOffset;
              lineItem.ty = textHeight;
              textArray.push({
                items: wrapLine.items,
                width: wrapLine.width,
                height: wrapLine.height,
              });
            }
            wrapLine.reset();
            textOffset = 0;
            textHeight += measure.height + lineHeight;
          } else {
            lineItem.text = measureText;
            lineItem.width = measure.width;
            lineItem.height = measure.height;
            lineItem.ascent = measure.ascent;
            wrapLine.width = lineWidth;
            if (measure.height > wrapLine.height) {
              wrapLine.height = measure.height;
            }
            innerIndex += 1;
          }
        }
        if (wrapLine.width > 0) {
          textOffset += wrapLine.width;
          textHeight += wrapLine.height + lineHeight;
        }
        breakIndex += 1;
      }
      wrapLine.increase();
      draw.restore();
    }
    if (wrapLine.width > 0) {
      const lineItem = wrapLine.getOrNew();
      lineItem.tx = textOffset;
      lineItem.ty = textHeight;
      textArray.push({
        items: wrapLine.items,
        width: wrapLine.width,
        height: wrapLine.height,
      });
      textHeight += wrapLine.height + lineHeight;
    }
    this.textWrapTextArray = textArray;
    this.textWrapTextHeight = textHeight;
    this.setUsedType(BaseRuler.USED.TEXT_WRAP);
  }

  equals(other) {
    if (other === null) {
      return false;
    }
    if (other.constructor !== RichHorizonRuler) {
      return false;
    }
    if (!PlainUtils.equals(this.rich, other.rich)) {
      return false;
    }
    if (other.align !== this.align) {
      return false;
    }
    if (other.padding !== this.padding) {
      return false;
    }
    if (other.textWrap !== this.textWrap) {
      return false;
    }
    const diffWidth = other.rect.width !== this.rect.width;
    const diffHeight = other.rect.height !== this.rect.height;
    if (diffWidth || diffHeight) {
      return false;
    }
    switch (this.textWrap) {
      case BaseFont.TEXT_WRAP.WORD_WRAP: {
        if (other.lineHeight !== this.lineHeight) {
          return false;
        }
        break;
      }
    }
    return true;
  }

}

export {
  RichHorizonRuler,
};
