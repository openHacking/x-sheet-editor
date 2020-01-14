/* global document */

import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { h } from '../lib/Element';
import { Utils } from '../utils/Utils';
import { Constant } from '../utils/Constant';
import { EventBind } from '../utils/EventBind';

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
    this.isHide = true;
    this.hide();
  }

  init() {
    this.css(this.option.style);
    this.bind();
  }

  bind() {
    this.block.on(Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (evt1) => {
      const downEventXy = this.computeEventXy(evt1, this.block);
      EventBind.mouseMoveUp(h(document), (evt2) => {
        // 计算移动的距离
        const moveEventXy = this.computeEventXy(evt2, this.content);
        let left = moveEventXy.x - downEventXy.x;
        if (left < 0) left = 0;
        if (left > this.maxBlockLeft) left = this.maxBlockLeft;
        // 计算滑动的距离
        this.blockLeft = left;
        this.scrollTo = this.computeScrollTo(this.blockLeft);
        this.block.css('left', `${left}px`);
        this.option.scroll(this.scrollTo);
        evt2.stopPropagation();
        evt2.preventDefault();
      });
      evt1.stopPropagation();
      evt1.preventDefault();
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
      this.scrollTo = this.computeScrollTo(this.blockLeft);
      this.block.css('left', `${this.blockLeft}px`);
      this.option.scroll(this.scrollTo);
    } else {
      this.isHide = true;
      this.hide();
      this.option.scroll(0);
    }
  }

  scrollMove(move) {
    let to = move;
    const maxTo = this.contentWidth - this.viewPortWidth;
    if (to > maxTo) to = maxTo; else if (to < 0) to = 0;
    const blockLeft = (to / (this.contentWidth - this.viewPortWidth)) * this.maxBlockLeft;
    this.blockLeft = blockLeft > this.maxBlockLeft ? this.maxBlockLeft : blockLeft;
    this.scrollTo = to;
    this.block.css('left', `${this.blockLeft}px`);
    this.option.scroll(this.scrollTo);
  }

  computeScrollTo(move) {
    return (move / this.maxBlockLeft) * (this.contentWidth - this.viewPortWidth);
  }
}

export { ScrollBarX };
