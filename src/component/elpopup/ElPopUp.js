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
import { EventBind } from '../../utils/EventBind';
import { Constant } from '../../core/constant/Constant';

const EL_POPUP_POSITION = {
  TOP: 1,
  LEFT: 2,
  BOTTOM: 3,
  RIGHT: 4,
};

const POOL = [];

class ElPopUp extends Widget {

  constructor(options) {
    super(`${cssPrefix}-el-pop-up`);
    this.options = Utils.mergeDeep({
      position: EL_POPUP_POSITION.BOTTOM,
      el: null,
    }, options);
    this.off = true;
    this.content = h('div', `${cssPrefix}-el-pop-up-content`);
    this.scrollBarX = new ScrollBarX();
    this.scrollBarY = new ScrollBarY();
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
    const contentVerticalLayerElement = new VerticalLayerElement(horizontalLayer);
    const scrollBarXVerticalLayerElement = new VerticalLayerElement(this.scrollBarX);
    const verticalLayer = new VerticalLayer({
      layerElements: [contentVerticalLayerElement, scrollBarXVerticalLayerElement],
    });
    super.children(verticalLayer);
    this.bind();
    POOL.push(this);
  }

  bind() {
    EventBind.bind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, () => {
      this.position();
      this.scrollbar();
    });
  }

  children(...args) {
    this.content.children(...args);
  }

  position() {
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

  scrollbar() {
    const { content } = this;
    const contentBox = content.box();
    const box = this.box();
    this.scrollBarY.setSize(box.height, contentBox.height);
    this.scrollBarX.setSize(box.width, contentBox.width);
  }

  open() {
    if (this.off) {
      h(document.body).children(this);
      this.position();
      this.scrollbar();
      this.off = false;
    }
  }

  close() {
    if (this.off === false) {
      h(document.body).remove(this);
      this.off = true;
    }
  }

  static closeAll(filter = []) {
    POOL.forEach((item) => {
      if (filter.indexOf(item) === -1) {
        item.close();
      }
    });
  }
}

export { ElPopUp, EL_POPUP_POSITION };
