/* global document */
import { BaseEdit } from './BaseEdit';
import { h } from '../../../lib/Element';
import { SheetUtils } from '../../../utils/SheetUtils';
import { XSelection } from '../../../lib/XSelection';

class StyleEdit extends BaseEdit {

  constructor(table) {
    super(table);
    this.xselection = new XSelection(this);
  }

  defaultWrap() {
    this.finds('font').forEach((ele) => {
      const color = ele.attr('color');
      const size = ele.attr('size');
      const name = ele.attr('name');
      if (SheetUtils.isDef(size)) {
        ele.after(h('span').css('font-size', `${size}px`).childrenNodesAppend(ele)).remove();
      }
      if (SheetUtils.isDef(name)) {
        ele.after(h('span').css('name', name).childrenNodesAppend(ele)).remove();
      }
      if (SheetUtils.isDef(color)) {
        ele.after(h('span').css('color', color).childrenNodesAppend(ele)).remove();
      }
    });
    this.finds('strike').forEach((ele) => {
      ele.after(h('span').css('text-decoration', 'line-through').childrenNodesAppend(ele)).remove();
    });
    this.finds('u').forEach((ele) => {
      ele.after(h('span').css('text-decoration', 'underline').childrenNodesAppend(ele)).remove();
    });
    this.finds('b').forEach((ele) => {
      ele.after(h('span').css('font-weight', 'bold').childrenNodesAppend(ele)).remove();
    });
    this.finds('i').forEach((ele) => {
      ele.after(h('span').css('font-style', 'italic').childrenNodesAppend(ele)).remove();
    });
  }

  fontSize(size) {
    this.xselection.wrapSelectNodeStyle('font-size', `${size}px`);
  }

  fontFamily(name) {
    this.xselection.wrapSelectNodeStyle('font-family', name);
  }

  fontColor(color) {
    this.xselection.wrapSelectNodeStyle('color', color);
  }

  fontBold() {
    this.xselection.toggleSelectNodeStyle('font-weight', 'bold');
  }

  fontItalic() {
    this.xselection.toggleSelectNodeStyle('font-style', 'italic');
  }

  underLine() {
    this.xselection.toggleSelectNodeStyle('text-decoration', 'underline');
  }

  strikeLine() {
    this.xselection.toggleSelectNodeStyle('text-decoration', 'line-through');
  }

  insertHtml(html) {
    document.execCommand('insertHTML', false, html);
  }

}

export {
  StyleEdit,
};
