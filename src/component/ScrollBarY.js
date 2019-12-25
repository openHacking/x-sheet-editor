/* global document */

import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { h } from '../lib/Element';
import { Constant } from '../utils/Constant';
import { Utils } from '../utils/Utils';
import { Event } from '../utils/Event';

class ScrollBarY extends Widget {
  constructor(option) {
    super(`${cssPrefix}-scroll-bar-y`);
    this.option = Utils.mergeDeep({
      style: {},
      scroll: to => to,
    }, option);
    this.lastBut = h('div', `${cssPrefix}-scroll-bar-y-last-but`);
    this.nextBut = h('div', `${cssPrefix}-scroll-bar-y-next-but`);
    this.content = h('div', `${cssPrefix}-scroll-bar-y-content`);
    this.block = h('div', `${cssPrefix}-scroll-bar-y-block`);
    this.content.children(this.block);
    this.children(...[
      this.lastBut,
      this.nextBut,
      this.content,
    ]);
    this.blockTop = 0;
    this.maxBlockTop = 0;
    this.blockHeight = 0;
    this.minBlockHeight = 10;
    this.scrollTo = 0;
    this.contentHeight = 0;
    this.viewPortHeight = 0;
    this.isHide = true;
    this.hide();
  }

  init() {
    this.css(this.option.style);
    this.bind();
  }

  bind() {
    this.block.on(Constant.EVENT_TYPE.MOUSE_DOWN, (evt1) => {
      const downEventXy = this.computerEventXy(evt1, this.block);
      Event.mouseMoveUp(h(document), (evt2) => {
        // 计算移动的距离
        const moveEventXy = this.computerEventXy(evt2, this.content);
        let top = moveEventXy.y - downEventXy.y;
        if (top < 0) top = 0;
        if (top > this.maxBlockTop) top = this.maxBlockTop;
        // 计算滑动的距离
        this.blockTop = top;
        this.scrollTo = this.computerScrollTo(this.blockTop);
        this.block.css('top', `${top}px`);
        this.option.scroll(this.scrollTo);
      });
    });
  }

  setSize(viewPortHeight, contentHeight) {
    if (viewPortHeight < contentHeight) {
      this.isHide = false;
      this.show();
      // 计算滑块高度
      const contentBox = this.content.box();
      const blockHeight = viewPortHeight / contentHeight * contentBox.height;
      this.blockHeight = blockHeight < this.minBlockHeight ? this.minBlockHeight : blockHeight;
      this.viewPortHeight = viewPortHeight;
      this.contentHeight = contentHeight;
      this.maxBlockTop = contentBox.height - this.blockHeight;
      this.block.css('height', `${this.blockHeight}px`);
      // 计算滑块位置
      const blockTop = (this.scrollTo / (contentHeight - viewPortHeight)) * this.maxBlockTop;
      this.blockTop = blockTop > this.maxBlockTop ? this.maxBlockTop : blockTop;
      this.scrollTo = this.computerScrollTo(this.blockTop);
      this.block.css('top', `${this.blockTop}px`);
      this.option.scroll(this.scrollTo);
    } else {
      this.isHide = true;
      this.hide();
      this.option.scroll(0);
    }
  }

  scrollMove(move) {
    let to = move;
    const maxTo = this.contentHeight - this.viewPortHeight;
    if (to > maxTo) to = maxTo; else if (to < 0) to = 0;
    const blockTop = (to / (this.contentHeight - this.viewPortHeight)) * this.maxBlockTop;
    this.blockTop = blockTop > this.maxBlockTop ? this.maxBlockTop : blockTop;
    this.scrollTo = to;
    this.block.css('top', `${this.blockTop}px`);
    this.option.scroll(this.scrollTo);
  }

  computerScrollTo(move) {
    return (move / this.maxBlockTop) * (this.contentHeight - this.viewPortHeight);
  }
}

export { ScrollBarY };
