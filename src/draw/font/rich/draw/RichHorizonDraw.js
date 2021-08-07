import { BaseRich } from '../BaseRich';
import { DrawResult } from '../../DrawResult';
import { BaseFont } from '../../BaseFont';
import { Crop } from '../../../Crop';
import { SheetUtils } from '../../../../utils/SheetUtils';

class RichHorizonDraw extends BaseRich {

  constructor({
    draw, ruler, rect, overflow, lineHeight = 4, attr,
  }) {
    super({
      draw, ruler, attr,
    });
    this.overflow = overflow;
    this.rect = rect;
    this.lineHeight = lineHeight;
  }

  drawingFont() {
    const { ruler } = this;
    if (ruler.isBlank()) {
      return new DrawResult();
    }
    if (ruler.richHasBreak()) {
      return this.textWrapDraw();
    }
    const { attr } = this;
    const { textWrap } = attr;
    switch (textWrap) {
      case BaseFont.TEXT_WRAP.OVER_FLOW:
        return this.overflowDraw();
      case BaseFont.TEXT_WRAP.TRUNCATE:
        return this.truncateDraw();
      case BaseFont.TEXT_WRAP.WORD_WRAP:
        return this.textWrapDraw();
    }
    return new DrawResult();
  }

  drawingLine(type, tx, ty, textWidth, textHeight) {
    const { draw, attr } = this;
    const { verticalAlign, align } = attr;
    const s = [0, 0];
    const e = [0, 0];
    if (type === 'strike') {
      switch (align) {
        case BaseFont.ALIGN.left:
        case BaseFont.ALIGN.center:
        case BaseFont.ALIGN.right:
          s[0] = tx;
          e[0] = tx + textWidth;
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top:
        case BaseFont.VERTICAL_ALIGN.center:
        case BaseFont.VERTICAL_ALIGN.bottom:
          s[1] = ty + textHeight / 2;
          e[1] = ty + textHeight / 2;
          break;
      }
    }
    if (type === 'underline') {
      switch (align) {
        case BaseFont.ALIGN.left:
        case BaseFont.ALIGN.center:
        case BaseFont.ALIGN.right:
          s[0] = tx;
          e[0] = tx + textWidth;
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top:
        case BaseFont.VERTICAL_ALIGN.center:
        case BaseFont.VERTICAL_ALIGN.bottom:
          s[1] = ty + textHeight;
          e[1] = ty + textHeight;
          break;
      }
    }
    draw.line(s, e);
  }

  truncateDraw() {
    const { draw, ruler, attr } = this;
    const { rect } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign } = attr;
    // 文字宽度
    ruler.truncateRuler();
    const {
      truncateText: textArray,
      truncateTextWidth: textWidth,
      truncateTextHeight: textHeight,
    } = ruler;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    switch (align) {
      case BaseFont.ALIGN.left:
        bx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        bx += width / 2 - textWidth / 2;
        break;
      case BaseFont.ALIGN.right:
        bx += width - textWidth - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        by += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2 - textHeight / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - textHeight - verticalAlignPadding;
        break;
    }
    // 边界检查
    const outboundsHeight = textHeight + verticalAlignPadding > height;
    const outboundsWidth = textWidth + alignPadding > width;
    if (outboundsHeight || outboundsWidth) {
      const crop = new Crop({
        draw,
        rect,
      });
      crop.open();
      for (let i = 0, len = textArray.length; i < len; i++) {
        const item = textArray[i];
        const style = SheetUtils.extends({}, attr, item.style);
        const fontItalic = `${style.italic ? 'italic' : ''}`;
        const fontBold = `${style.bold ? 'bold' : ''}`;
        const fontSize = `${style.size}px`;
        const fontName = `${style.name}`;
        const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
        draw.save();
        draw.attr({
          font: fontStyle.trim(),
          fillStyle: style.color,
          strokeStyle: style.color,
        });
        const tx = bx + item.tx;
        const ty = by + item.ty;
        draw.fillText(item.text, tx, ty + item.ascent);
        if (underline) {
          this.drawingLine('underline', tx, ty, item.width, item.height);
        }
        if (strikethrough) {
          this.drawingLine('strike', tx, ty, item.width, item.height);
        }
        draw.restore();
      }
      crop.close();
    } else {
      for (let i = 0, len = textArray.length; i < len; i++) {
        const item = textArray[i];
        const style = SheetUtils.extends({}, attr, item.style);
        const fontItalic = `${style.italic ? 'italic' : ''}`;
        const fontBold = `${style.bold ? 'bold' : ''}`;
        const fontSize = `${style.size}px`;
        const fontName = `${style.name}`;
        const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
        draw.save();
        draw.attr({
          font: fontStyle.trim(),
          fillStyle: style.color,
          strokeStyle: style.color,
        });
        const tx = bx + item.tx;
        const ty = by + item.ty;
        draw.fillText(item.text, tx, ty + item.ascent);
        if (underline) {
          this.drawingLine('underline', tx, ty, item.width, item.height);
        }
        if (strikethrough) {
          this.drawingLine('strike', tx, ty, item.width, item.height);
        }
        draw.restore();
      }
    }
    return new DrawResult();
  }

  overflowDraw() {
    const { draw, ruler, attr } = this;
    const { rect, overflow } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign } = attr;
    // 文字宽度
    ruler.overflowRuler();
    const {
      overflowText: textArray,
      overflowTextWidth: textWidth,
      overflowTextHeight: textHeight,
    } = ruler;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    switch (align) {
      case BaseFont.ALIGN.left:
        bx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        bx += width / 2 - textWidth / 2;
        break;
      case BaseFont.ALIGN.right:
        bx += width - textWidth - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        by += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2 - textHeight / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - textHeight - verticalAlignPadding;
        break;
    }
    // 边界检查
    const outboundsHeight = textHeight + verticalAlignPadding > overflow.height;
    const outboundsWidth = textWidth + alignPadding > overflow.width;
    let pointOffset = false;
    if (align === BaseFont.ALIGN.center) {
      const diff = textWidth / 2 - width / 2;
      if (diff > 0) {
        if (overflow.x > rect.x - diff) {
          pointOffset = true;
        } else if (overflow.x + overflow.width < rect.x + rect.width + diff) {
          pointOffset = true;
        }
      }
    }
    if (outboundsHeight || outboundsWidth || pointOffset) {
      const crop = new Crop({
        draw,
        rect: overflow,
      });
      crop.open();
      for (let i = 0, len = textArray.length; i < len; i++) {
        const item = textArray[i];
        const style = SheetUtils.extends({}, attr, item.style);
        const fontItalic = `${style.italic ? 'italic' : ''}`;
        const fontBold = `${style.bold ? 'bold' : ''}`;
        const fontSize = `${style.size}px`;
        const fontName = `${style.name}`;
        const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
        draw.save();
        draw.attr({
          font: fontStyle.trim(),
          fillStyle: style.color,
          strokeStyle: style.color,
        });
        const tx = bx + item.tx;
        const ty = by + item.ty;
        draw.fillText(item.text, tx, ty + item.ascent);
        if (underline) {
          this.drawingLine('underline', tx, ty, item.width, item.height);
        }
        if (strikethrough) {
          this.drawingLine('strike', tx, ty, item.width, item.height);
        }
        draw.restore();
      }
      crop.close();
    } else {
      for (let i = 0, len = textArray.length; i < len; i++) {
        const item = textArray[i];
        const style = SheetUtils.extends({}, attr, item.style);
        const fontItalic = `${style.italic ? 'italic' : ''}`;
        const fontBold = `${style.bold ? 'bold' : ''}`;
        const fontSize = `${style.size}px`;
        const fontName = `${style.name}`;
        const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
        draw.save();
        draw.attr({
          font: fontStyle.trim(),
          fillStyle: style.color,
          strokeStyle: style.color,
        });
        const tx = bx + item.tx;
        const ty = by + item.ty;
        draw.fillText(item.text, tx, ty + item.ascent);
        if (underline) {
          this.drawingLine('underline', tx, ty, item.width, item.height);
        }
        if (strikethrough) {
          this.drawingLine('strike', tx, ty, item.width, item.height);
        }
        draw.restore();
      }
    }
    return new DrawResult({
      width: textWidth + alignPadding,
    });
  }

  textWrapDraw() {
    const { rect, draw, ruler, attr } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign } = attr;
    // 填充尺寸
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 计算文本折行
    ruler.textWrapRuler();
    const {
      textWrapTextArray: textArray,
      textWrapTextHeight: textHeight,
    } = ruler;
    // 边界检查
    const outboundsHeight = textHeight > height;
    if (outboundsHeight) {
      const crop = new Crop({
        draw,
        rect,
      });
      crop.open();
      for (let index = 0, textLength = textArray.length; index < textLength; index++) {
        // 文本信息
        let wrapLine = textArray[index];
        // 计算文本坐标
        let bx = rect.x;
        let by = rect.y;
        // 对齐方式
        switch (align) {
          case BaseFont.ALIGN.left:
            bx += alignPadding;
            break;
          case BaseFont.ALIGN.center:
            bx += width / 2 - wrapLine.width / 2;
            break;
          case BaseFont.ALIGN.right:
            bx += width - wrapLine.width - alignPadding;
            break;
        }
        switch (verticalAlign) {
          case BaseFont.VERTICAL_ALIGN.top:
            by += verticalAlignPadding;
            break;
          case BaseFont.VERTICAL_ALIGN.center:
            by += height / 2 - textHeight / 2;
            break;
          case BaseFont.VERTICAL_ALIGN.bottom:
            by += height - textHeight - verticalAlignPadding;
            break;
        }
        // 子文本
        let subLength = wrapLine.items.length;
        let subIndex = 0;
        while (subIndex < subLength) {
          // 绘制文本
          const item = wrapLine.items[subIndex];
          const style = SheetUtils.extends({}, attr, item.style);
          const tx = item.tx + bx;
          const ty = item.ty + by;
          const fontItalic = `${style.italic ? 'italic' : ''}`;
          const fontBold = `${style.bold ? 'bold' : ''}`;
          const fontSize = `${style.size}px`;
          const fontName = `${style.name}`;
          const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
          draw.save();
          draw.attr({
            font: fontStyle.trim(),
            fillStyle: style.color,
            strokeStyle: style.color,
          });
          draw.fillText(item.text, tx, ty + item.ascent);
          if (underline) {
            this.drawingLine('underline', tx, ty, item.width, item.height);
          }
          if (strikethrough) {
            this.drawingLine('strike', tx, ty, item.width, item.height);
          }
          draw.restore();
          subIndex++;
        }
      }
      crop.close();
    } else {
      for (let index = 0, textLength = textArray.length; index < textLength; index++) {
        // 文本信息
        let wrapLine = textArray[index];
        // 计算文本坐标
        let bx = rect.x;
        let by = rect.y;
        // 对齐方式
        switch (align) {
          case BaseFont.ALIGN.left:
            bx += alignPadding;
            break;
          case BaseFont.ALIGN.center:
            bx += width / 2 - wrapLine.width / 2;
            break;
          case BaseFont.ALIGN.right:
            bx += width - wrapLine.width - alignPadding;
            break;
        }
        switch (verticalAlign) {
          case BaseFont.VERTICAL_ALIGN.top:
            by += verticalAlignPadding;
            break;
          case BaseFont.VERTICAL_ALIGN.center:
            by += height / 2 - textHeight / 2;
            break;
          case BaseFont.VERTICAL_ALIGN.bottom:
            by += height - textHeight - verticalAlignPadding;
            break;
        }
        // 子文本
        let subLength = wrapLine.items.length;
        let subIndex = 0;
        while (subIndex < subLength) {
          // 绘制文本
          const item = wrapLine.items[subIndex];
          const style = SheetUtils.extends({}, attr, item.style);
          const tx = item.tx + bx;
          const ty = item.ty + by;
          const fontItalic = `${style.italic ? 'italic' : ''}`;
          const fontBold = `${style.bold ? 'bold' : ''}`;
          const fontSize = `${style.size}px`;
          const fontName = `${style.name}`;
          const fontStyle = `${fontItalic} ${fontBold} ${fontSize} ${fontName}`;
          draw.save();
          draw.attr({
            font: fontStyle.trim(),
            fillStyle: style.color,
            strokeStyle: style.color,
          });
          draw.fillText(item.text, tx, ty + item.ascent);
          if (underline) {
            this.drawingLine('underline', tx, ty, item.width, item.height);
          }
          if (strikethrough) {
            this.drawingLine('strike', tx, ty, item.width, item.height);
          }
          draw.restore();
          subIndex++;
        }
      }
    }
    return new DrawResult();
  }

}

export {
  RichHorizonDraw,
};
