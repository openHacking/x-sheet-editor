import { cssPrefix } from '../../../const/Constant';
import { Widget } from '../../../libs/Widget';
import { Throttle } from '../../../libs/Throttle';
import { BaseFont } from '../../../canvas/font/BaseFont';
import { XDraw } from '../../../canvas/XDraw';

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
    this.merge = null;
    this.table = table;
    this.cell = null;
    this.select = null;
    this.throttle = new Throttle({
      time: 100,
    });
    this.mode = BaseEdit.MODE.HIDE;
    this.attr('contenteditable', true);
    this.hide();
  }

  /**
   * 注册焦点元素
   */
  onAttach() {
    const { table } = this;
    table.focus.register({ target: this });
  }

  /**
   * 编辑器定位
   */
  offsetEdit() {
    const { table, cell } = this;
    const { xHeightLight, yHeightLight } = table;
    const { fontAttr } = cell;
    const { align } = fontAttr;
    const height = yHeightLight.getHeight();
    const width = xHeightLight.getWidth();
    const top = yHeightLight.getTop() + table.getIndexHeight();
    const left = xHeightLight.getLeft() + table.getIndexWidth();
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

}

BaseEdit.MODE = {
  SHOW: Symbol('显示'),
  HIDE: Symbol('隐藏'),
};

export {
  BaseEdit,
};
