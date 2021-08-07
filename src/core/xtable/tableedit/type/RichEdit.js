import { XDraw } from '../../../../draw/XDraw';
import { h } from '../../../../lib/Element';
import { StyleEdit } from '../base/StyleEdit';
import { SheetUtils } from '../../../../utils/SheetUtils';
import { RichFonts } from '../../tablecell/RichFonts';
import { Constant } from '../../../../const/Constant';

/**
 * RichEdit
 */
class RichEdit extends StyleEdit {

  /**
   * 富文本转Html
   * @constructor
   */
  richTextToHtml() {
    const { activeCell } = this;
    const { fonts } = activeCell.getComputeText();
    const textBreak = /\n/;
    const items = [];
    const empty = [this.EMPTY];
    fonts.forEach((font) => {
      const { text, name, size, bold, italic, color, underline, strikethrough } = font;
      const array = text.split(textBreak);
      array.forEach((text) => {
        const item = h('p');
        const line = [];
        if (strikethrough) {
          line.push('line-through');
        }
        if (underline) {
          line.push('underline');
        }
        const { length } = line;
        const strike = length ? line.join(' ') : 'none';
        item.css('font-family', name);
        item.css('color', color);
        item.css('text-decoration', strike);
        item.css('font-size', `${XDraw.cssPx(size)}px`);
        item.css('font-weight', bold ? 'bold' : 'none');
        item.css('font-style', italic ? 'italic' : 'none');
        item.text(text);
        items.push(item);
      });
    });
    const { length } = items;
    return length ? items : empty;
  }

  /**
   * Html转富文本
   * @constructor
   */
  htmlToRichText() {
    const { activeCell, selectRange } = this;
    const { table } = this;
    const { sri, sci } = selectRange;
    const cloneCell = activeCell.clone();
    const { snapshot } = table;
    const element = this.find('p');
    const items = [];
    const findNodes = (ele) => {
      const clone = ele.clone();
      return clone.children()
        .filter(i => i.nodeType === 1);
    };
    const findFonts = (ele) => {
      const clone = findNodes(ele);
      clone.forEach(i => i.remove());
      return clone.text();
    };
    const handleRow = (ele) => {
      const collect = [];
      return (function handle(ele, parent) {
        const tagName = ele.tagName();
        const node = findNodes(ele);
        const text = findFonts(ele);
        const style = { ...parent };
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
            const size = ele.attr('size');
            const name = ele.attr('face');
            const color = ele.attr('color');
            if (size) {
              style.size = SheetUtils.parseInt(size);
            }
            if (name) {
              style.name = name;
            }
            if (color) {
              style.color = color;
            }
            break;
          }
          case 'strike': {
            style.strikethrough = true;
            break;
          }
        }
        collect.push({
          text, style,
        });
        node.forEach((item) => {
          handle(item, style);
        });
        return collect;
      }(ele, {}));
    };
    element.forEach((p) => {
      items.push(handleRow(p));
    });
    const rich = new RichFonts({
      fonts: items,
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

  }

}

export {
  RichEdit,
};
