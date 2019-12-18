/* global document */

import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { h } from '../lib/Element';
import { Utils } from '../utils/Utils';
import { Constant } from '../utils/Constant';

class ScrollBarX extends Widget {
  constructor(option) {
    super(`${cssPrefix}-scroll-bar-x`);
    this.option = Utils.mergeDeep({
      style: {},
      scroll: to => to,
    }, option);
    this.lastBut = h('div', `${cssPrefix}-scroll-bar-x-last-but`);
    this.nextBut = h('div', `${cssPrefix}-scroll-bar-x-next-but`);
    this.content = h('div', `${cssPrefix}-scroll-bar-x-content`);
    this.block = h('div', `${cssPrefix}-scroll-bar-x-block`);
    this.content.children(this.block);
    this.children(...[
      this.lastBut,
      this.nextBut,
      this.content,
    ]);
    this.blockLeft = 0;
    this.maxBlockLeft = 0;
    this.blockWidth = 0;
    this.minBlockWidth = 10;
    this.scrollTo = 0;
    this.contentWidth = 0;
    this.viewPortWidth = 0;
    this.down = false;
    this.isHide = false;
  }

  init() {
    this.css(this.option.style);
    this.bind();
  }

  bind() {
    let downEventXy = null;
    this.on(Constant.EVENT_TYPE.MOUSE_WHEEL, () => {});
    this.block.on(Constant.EVENT_TYPE.MOUSE_DOWN, (event) => {
      this.down = true;
      downEventXy = this.computerEventXy(this.block, event);
    });
    h(document).on(Constant.EVENT_TYPE.MOUSE_UP, () => {
      this.down = false;
    });
    h(document).on(Constant.EVENT_TYPE.MOUSE_MOVE, (event) => {
      if (!this.down) return;
      // 计算移动的距离
      const moveEventXy = this.computerEventXy(this.content, event);
      let left = moveEventXy.x - downEventXy.x;
      if (left < 0) left = 0;
      if (left > this.maxBlockLeft) left = this.maxBlockLeft;
      // 计算滑动的距离
      this.blockLeft = left;
      this.scrollTo = this.computerScrollTo(this.blockLeft);
      this.block.css('left', `${left}px`);
      this.option.scroll(this.scrollTo);
    });
  }

  setSize(viewPortWidth, contentWidth) {
    if (viewPortWidth < contentWidth) {
      this.isHide = false;
      this.show();
      // 计算滑块宽度
      const contentBox = this.content.box();
      const blockWidth = viewPortWidth / contentWidth * contentBox.width;
      this.blockWidth = blockWidth < this.minBlockWidth ? this.minBlockWidth : blockWidth;
      this.viewPortWidth = viewPortWidth;
      this.contentWidth = contentWidth;
      this.maxBlockLeft = contentBox.width - this.blockWidth;
      this.block.css('width', `${this.blockWidth}px`);
      // 计算滑块位置
      const blockLeft = (this.scrollTo / (contentWidth - viewPortWidth)) * this.maxBlockLeft;
      this.blockLeft = blockLeft > this.maxBlockLeft ? this.maxBlockLeft : blockLeft;
      this.scrollTo = this.computerScrollTo(this.blockLeft);
      this.block.css('left', `${this.blockLeft}px`);
      this.option.scroll(this.scrollTo);
    } else {
      this.isHide = true;
      this.hide();
      this.option.scroll(0);
    }
  }

  computerScrollTo(move) {
    return (move / this.maxBlockLeft) * (this.contentWidth - this.viewPortWidth);
  }
}

export { ScrollBarX };
