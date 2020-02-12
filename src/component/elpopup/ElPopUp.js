/* global document window */

import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { h } from '../../lib/Element';
import { ScrollBarX } from '../scrollbar/ScrollBarX';
import { ScrollBarY } from '../scrollbar/ScrollBarY';
import { Utils } from '../../utils/Utils';
import { HorizontalLayerElement } from '../../lib/layer/HorizontalLayerElement';
import { HorizontalLayer } from '../../lib/layer/HorizontalLayer';
import { VerticalLayer } from '../../lib/layer/VerticalLayer';
import { VerticalLayerElement } from '../../lib/layer/VerticalLayerElement';
import { Animate } from '../../lib/animate/Animate';
import { EventBind } from '../../utils/EventBind';
import { Constant } from '../../utils/Constant';

const EL_POPUP_POSITION = {
  TOP: 1,
  LEFT: 2,
  BOTTOM: 3,
  RIGHT: 4,
};

const pool = [];

class ElPopUp extends Widget {
  constructor(className, options) {
    super(`${cssPrefix}-el-pop-up ${className}`);
    this.options = Utils.copyProp({
      position: EL_POPUP_POSITION.BOTTOM,
      el: null,
    }, options);
    this.content = h('div', `${cssPrefix}-el-pop-up-content`);
    this.scrollBarX = new ScrollBarX();
    this.scrollBarY = new ScrollBarY();
    this.off = false;

    this.animate1 = null;
    this.animate2 = null;
    this.animate3 = null;
    this.animate4 = null;

    // 水平布局
    const contentLayerHorizontalElement = new HorizontalLayerElement(this.content, {
      style: {
        flexGrow: 1,
      },
    });
    const scrollBarYLayerHorizontalElement = new HorizontalLayerElement(this.scrollBarY, {
      style: {
        overflow: 'inherit',
      },
    });
    const horizontalLayer = new HorizontalLayer({
      layerElements: [contentLayerHorizontalElement, scrollBarYLayerHorizontalElement],
    });

    // 垂直布局
    const contentVerticalLayerElement = new VerticalLayerElement(horizontalLayer);
    const scrollBarXVerticalLayerElement = new VerticalLayerElement(this.scrollBarX);
    const verticalLayer = new VerticalLayer({
      layerElements: [contentVerticalLayerElement, scrollBarXVerticalLayerElement],
    });

    super.children(verticalLayer);
    this.bind();
    pool.push(this);
  }

  bind() {
    EventBind.bind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, () => {
      this.computePosition();
      this.computeScrollSize();
    });
  }

  children(...args) {
    this.content.children(...args);
  }

  computePosition() {
    const { content } = this;
    const { el, position } = this.options;
    const elBox = el.box();
    const contentBox = content.box();
    let { top, left } = elBox;
    switch (position) {
      case EL_POPUP_POSITION.TOP:
        top = elBox.top - contentBox.height;
        break;
      case EL_POPUP_POSITION.LEFT:
        left = elBox.left - contentBox.width;
        break;
      case EL_POPUP_POSITION.RIGHT:
        left = elBox.left + elBox.width;
        break;
      case EL_POPUP_POSITION.BOTTOM:
        top = elBox.top + elBox.height;
        break;
      default: break;
    }
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    if (left < 0 || left + contentBox.width > maxWidth) {
      // 左右颠倒
      switch (position) {
        case EL_POPUP_POSITION.LEFT:
          left = elBox.left + elBox.width;
          break;
        case EL_POPUP_POSITION.RIGHT:
          left = elBox.left - contentBox.width;
          break;
        default: break;
      }
    }
    if (top < 0 || top + contentBox.height > maxHeight) {
      // 上下颠倒
      switch (position) {
        case EL_POPUP_POSITION.TOP:
          top = elBox.top + elBox.height;
          break;
        case EL_POPUP_POSITION.BOTTOM:
          top = elBox.top - contentBox.height;
          break;
        default: break;
      }
    }
    if (left < 0 || left + contentBox.width > maxWidth) {
      top = elBox.top + elBox.height;
      ({ left } = elBox);
    }
    if (top < 0 || top + contentBox.height > maxHeight) {
      top = elBox.top + elBox.height;
      ({ left } = elBox);
    }
    this.offset({
      top,
      left,
    });
  }

  computeScrollSize() {
    const { content } = this;
    const contentBox = content.box();
    const box = this.box();
    this.scrollBarY.setSize(box.height, contentBox.height);
    this.scrollBarX.setSize(box.width, contentBox.width);
  }

  open() {
    if (this.off === false) {
      h(document.body).children(this);
      this.css('opacity', 0);
      this.computePosition();
      this.computeScrollSize();
      const popUpBox = this.box();
      if (this.animate1) this.animate1.cancel();
      if (this.animate2) this.animate2.cancel();
      if (this.animate3) this.animate3.cancel();
      if (this.animate4) this.animate4.cancel();
      this.animate1 = new Animate({
        begin: 0,
        end: 1,
        receive: (val) => {
          this.css('opacity', val);
        },
      });
      this.animate2 = new Animate({
        begin: popUpBox.top + 10,
        end: popUpBox.top,
        receive: (val) => {
          this.css('top', `${val}px`);
        },
      });
      this.animate1.request();
      this.animate2.request();
      this.off = true;
    }
  }

  close() {
    if (this.off) {
      const popUpBox = this.box();
      if (this.animate1) this.animate1.cancel();
      if (this.animate2) this.animate2.cancel();
      if (this.animate3) this.animate3.cancel();
      if (this.animate4) this.animate4.cancel();
      this.animate3 = new Animate({
        begin: 1,
        end: 0,
        receive: (val) => {
          this.css('opacity', val);
        },
      });
      this.animate4 = new Animate({
        begin: popUpBox.top,
        end: popUpBox.top + 10,
        receive: (val) => {
          this.css('top', `${val}px`);
        },
      });
      Animate.success(this.animate3, this.animate4).then(() => {
        h(document.body).remove(this);
        this.off = false;
      });
      this.animate3.request();
      this.animate4.request();
    }
  }

  static closeAll(filter = []) {
    pool.forEach((item) => {
      if (filter.indexOf(item) === -1) {
        item.close();
      }
    });
  }
}

export { ElPopUp, EL_POPUP_POSITION };
