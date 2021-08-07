import { XDraw } from '../../../draw/XDraw';
import { BaseFont } from '../../../draw/font/BaseFont';
import { SheetUtils } from '../../../utils/SheetUtils';
import { h } from '../../../lib/Element';
import { FormulaEdit } from './FormulaEdit';

class TextEdit extends FormulaEdit {

  /**
   * 文本转html
   * @param cell
   */
  cellTextToHtml(cell) {
    let { background, fontAttr } = cell;
    let { align, size, color } = fontAttr;
    let { bold, italic, name } = fontAttr;
    let fontSize = XDraw.cssPx(this.scale.goto(size));
    let textAlign = 'left';
    switch (align) {
      case BaseFont.ALIGN.left:
        textAlign = 'left';
        break;
      case BaseFont.ALIGN.center:
        textAlign = 'center';
        break;
      case BaseFont.ALIGN.right:
        textAlign = 'right';
        break;
    }
    let text = cell.getComputeText();
    let style = SheetUtils.clearBlank(`
      text-align:${textAlign};
      color: ${color};
      background:${background};
      font-style: ${italic ? 'italic' : 'initial'};
      font-weight: ${bold ? 'bold' : 'initial'};
      font-size: ${XDraw.cssPx(fontSize)}px;
      font-family: ${name};
    `);
    return h('div').text(text).style(style);
  }

  /**
   * html转文本
   * @param html
   */
  htmlToCellText(html) {
    return html;
  }

}

export {
  TextEdit,
};
