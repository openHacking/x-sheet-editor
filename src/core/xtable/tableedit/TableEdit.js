/* global document */
import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';
import { BaseFont } from '../../../draw/font/BaseFont';
import { XDraw } from '../../../draw/XDraw';
import { SheetUtils } from '../../../utils/SheetUtils';
import { h } from '../../../lib/Element';
import { RichFonts } from '../tablecell/RichFonts';

/**
 * BaseEdit
 */
class BaseEdit extends Widget {

  /**
   * BaseEdit
   * @param table
   */
  constructor({
    table,
  }) {
    super(`${cssPrefix}-table-edit`);
    this.table = table;
    this.cell = null;
    this.selectRange = null;
    this.EMPTY = '<p><br /></p>';
    this.hide();
  }

  /**
   * 添加键盘事件
   */
  onAttach() {
    const { table } = this;
    table.focus.register({ target: this });
  }

  /**
   * 编辑器定位
   */
  local() {
    const { table, cell } = this;
    const { xHeightLight, yHeightLight } = table;
    const { fontAttr } = cell;
    const { align } = fontAttr;
    const left = xHeightLight.getLeft() + table.getIndexWidth();
    const top = yHeightLight.getTop() + table.getIndexHeight();
    const height = yHeightLight.getHeight();
    const width = xHeightLight.getWidth();
    switch (align) {
      case BaseFont.ALIGN.left: {
        this.cssRemoveKeys('right');
        const maxHeight = table.visualHeight() - top;
        const maxWidth = table.visualWidth() - left;
        this.css({
          left: `${left}px`,
          top: `${top}px`,
          'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
          'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
          'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
          'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
        });
        break;
      }
      case BaseFont.ALIGN.center: {
        this.cssRemoveKeys('right');
        const box = this.box();
        const maxHeight = table.visualHeight() - top;
        if (box.width > width) {
          const maxWidth = (table.visualWidth() - (left + width)) * 2 + width;
          const realWidth = Math.min(box.width, maxWidth);
          const realLeft = left - (realWidth / 2 - width / 2);
          this.css({
            left: `${realLeft}px`,
            top: `${top}px`,
            'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
            'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
            'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
            'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
          });
        } else {
          const maxWidth = table.visualWidth() - left;
          this.css({
            left: `${left}px`,
            top: `${top}px`,
            'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
            'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
            'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
            'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
          });
        }
        break;
      }
      case BaseFont.ALIGN.right: {
        this.cssRemoveKeys('left');
        const maxWidth = (left + width) - table.getIndexWidth();
        const right = table.visualWidth() - (left + width);
        const maxHeight = table.visualHeight() - top;
        this.css({
          right: `${right}px`,
          top: `${top}px`,
          'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
          'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
          'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
          'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
        });
        break;
      }
    }
  }

  /**
   * 打开编辑器
   * @returns {BaseEdit}
   */
  open() {
    this.mode = BaseEdit.MODE.SHOW;
    this.show();
    this.local();
    this.throttle.action(() => {
      this.focus();
      SheetUtils.keepLastIndex(this.el);
    });
    return this;
  }

  /**
   * 关闭编辑器
   * @returns {BaseEdit}
   */
  close() {
    this.mode = BaseEdit.MODE.HIDE;
    this.hide();
    return this;
  }

  /**
   * 销毁编辑器
   */
  destroy() {
    super.destroy();
    this.unbind();
  }

}
BaseEdit.MODE = {
  SHOW: Symbol('显示'),
  HIDE: Symbol('隐藏'),
};

/**
 * StyleEdit
 */
class StyleEdit extends BaseEdit {

  /**
   * 设置用户选择区域的字体颜色
   * @param color
   */
  fontColor(color) {
    document.execCommand('foreColor', false, color);
  }

  /**
   * 设置用户选择区域的字体大小
   * @param size
   */
  fontSize(size) {
    document.execCommand('fontSize', false, size);
  }

  /**
   * 设置用户选择区域的字体名称
   * @param name
   */
  fontFamily(name) {
    document.execCommand('fontName', false, name);
  }

  /**
   * 设置用户选择区域的字体加粗
   */
  fontBold() {
    document.execCommand('bold', false);
  }

  /**
   * 设置用户选择区域的字体斜体
   */
  fontItalic() {
    document.execCommand('italic', false);
  }

  /**
   * 设置用户选择区域的字体下划线
   */
  underLine() {
    document.execCommand('underline', false);
  }

  /**
   * 设置用户选择区域的字体删除线
   */
  strikeLine() {
    document.execCommand('strikeThrough', false);
  }

}

/**
 * RichEdit
 */
class RichEdit extends StyleEdit {

  /**
   * 富文本转Html
   * @param rich
   * @constructor
   */
  richTextToHtml(rich) {
    const { fonts } = rich;
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
   * @param html
   * @constructor
   */
  htmlToRichText(html) {
    const div = h('div').html(html);
    const element = div.find('p');
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
            break;
          }
          case 'i': {
            break;
          }
          case 'b': {
            break;
          }
          case 'font': {
            break;
          }
          case 'strike': {
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
    return new RichFonts({
      fonts: items,
    });
  }

}

/**
 * FormulaEdit
 */
class FormulaEdit extends RichEdit {

}

/**
 * TableEdit
 */
class TableEdit extends FormulaEdit {

}

export {
  TableEdit,
};
