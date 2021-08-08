import { XDraw } from '../../../../draw/XDraw';
import { h } from '../../../../lib/Element';
import { StyleEdit } from '../base/StyleEdit';
import { SheetUtils } from '../../../../utils/SheetUtils';
import { RichFonts } from '../../tablecell/RichFonts';
import { Constant } from '../../../../const/Constant';
import { BaseFont } from '../../../../draw/font/BaseFont';

/**
 * RichEdit
 */
class RichEdit extends StyleEdit {

  /**
   * 富文本转Html
   * @constructor
   */
  richTextToHtml() {
    let { activeCell } = this;
    let { background, fontAttr } = activeCell;
    let { align, size, color } = fontAttr;
    let { bold, italic, name } = fontAttr;
    let { fonts } = activeCell.getComputeText();
    let textAlign = 'left';
    let fontSize = XDraw.cssPx(size);
    let items = [];
    fonts.forEach((font) => {
      let { text, name, size, bold, italic } = font;
      let { color, underline, strikethrough } = font;
      let item = text.replace(/\n/g, '<br/>');
      if (name) {
        item = `<font face="${name}">${item}</font>`;
      }
      if (size) {
        item = `<font size="${XDraw.cssPx(size)}">${item}</font>`;
      }
      if (bold) {
        item = `<b>${item}</b>`;
      }
      if (italic) {
        item = `<i>${item}</i>`;
      }
      if (color) {
        item = `<font color="${color}">${item}</font>`;
      }
      if (underline) {
        item = `<u>${item}</u>`;
      }
      if (strikethrough) {
        item = `<strike>${item}</strike>`;
      }
      items.push(item);
    });
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
    let style = SheetUtils.clearBlank(`
      text-align:${textAlign};
      color: ${color};
      background:${background};
      font-style: ${italic ? 'italic' : 'initial'};
      font-weight: ${bold ? 'bold' : 'initial'};
      font-size: ${fontSize}px;
      font-family: ${name};
    `);
    let html = items.join('');
    this.text(html).style(style);
  }

  /**
   * Html转富文本
   * @constructor
   */
  htmlToRichText() {
    const { activeCell } = this;
    const { table } = this;
    const { selectRange } = this;
    const { sri, sci } = selectRange;
    const { snapshot } = table;
    const cloneCell = activeCell.clone();
    const collect = [];
    const handle = (element, parent) => {
      const tagName = element.tagName();
      const style = { ...parent };
      if (element.isTextNode()) {
        collect.push({
          text: element.nodeValue(),
        });
        return;
      }
      if (element.isBreakNode()) {
        collect.push({
          text: '\n',
        });
        return;
      }
      if (!element.equals(this)) {
        switch (tagName) {
          case 'u': {
            style.underline = true;
            break;
          }
          case 'i': {
            style.italic = true;
            break;
          }
          case 'b': {
            style.bold = true;
            break;
          }
          case 'font': {
            const size = element.attr('size');
            const name = element.attr('name');
            const color = element.attr('size');
            style.size = SheetUtils.parseInt(size);
            style.name = name;
            style.color = color;
            break;
          }
          case 'strike': {
            style.strikethrough = true;
            break;
          }
        }
        collect.push({
          text: element.text(), style,
        });
      }
      const children = element.children();
      for (const child of children) {
        handle(child, style);
      }
    };
    handle(this, {});
    const rich = new RichFonts({
      fonts: collect,
    });
    snapshot.open();
    cloneCell.setRichText(rich);
    cloneCell.setCellOrNew(sri, sci, cloneCell);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
    });
    table.render();
  }

  /**
   * 检查输入的是否为富文本
   */
  checkedRichText() {
    return false;
  }

}

export {
  RichEdit,
};
