/* global window */
import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { h } from '../../lib/Element';
import { ScrollBarX } from '../scrollbar/ScrollBarX';
import { ScrollBarY } from '../scrollbar/ScrollBarY';
import { PlainUtils } from '../../utils/PlainUtils';
import { HorizontalLayerElement } from '../../lib/layer/HorizontalLayerElement';
import { HorizontalLayer } from '../../lib/layer/HorizontalLayer';
import { VerticalLayer } from '../../lib/layer/VerticalLayer';
import { VerticalLayerElement } from '../../lib/layer/VerticalLayerElement';
import { Event } from '../../lib/Event';

const EL_POPUP_POSITION = {
  TOP: 1,
  LEFT: 2,
  BOTTOM: 3,
  RIGHT: 4,
};

const POOL = [];

let root = null;

class ElPopUp extends Widget {

  constructor(options) {
    super(`${cssPrefix}-el-pop-up`);
    POOL.push(this);
    this.options = PlainUtils.mergeDeep({
      position: EL_POPUP_POSITION.BOTTOM,
      el: null,
    }, options);
    this.off = true;

    this.content = new Widget(`${cssPrefix}-el-pop-up-content`);
    this.scrollBarX = new ScrollBarX();
    this.scrollBarY = new ScrollBarY();

    // 内容
    const contentLayer = new HorizontalLayerElement({
      style: {
        flexGrow: 1,
      },
    });
    contentLayer.children(this.content);

    // Y 滚动条
    const scrollBarYLayer = new HorizontalLayerElement({
      style: {
        overflow: 'inherit',
      },
    });
    scrollBarYLayer.children(this.scrollBarY);

    const horizontalLayer = new HorizontalLayer();
    horizontalLayer.children(contentLayer);
    horizontalLayer.children(scrollBarYLayer);

    // 内容 & Y 滚动条
    const contentVerticalLayer = new VerticalLayerElement(horizontalLayer);
    contentVerticalLayer.children(horizontalLayer);

    // X 滚动条
    const scrollBarXVerticalLayer = new VerticalLayerElement();
    scrollBarXVerticalLayer.children(this.scrollBarX);

    const verticalLayer = new VerticalLayer();
    verticalLayer.children(contentVerticalLayer);
    verticalLayer.children(scrollBarXVerticalLayer);
    super.children(verticalLayer);

    this.bind();
  }

  bind() {
    Event.bind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, () => {
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
    if (this.off && root) {
      root.children(this);
      this.position();
      this.scrollbar();
      this.off = false;
    }
  }

  close() {
    if (this.off === false && root) {
      root.remove(this);
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

  static setRoot(element) {
    if (element.el) {
      element = h(element.el);
    } else {
      element = h(element);
    }
    root = element;
  }

}

export { ElPopUp, EL_POPUP_POSITION };
