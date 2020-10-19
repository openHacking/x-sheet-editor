/* global window */
import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { h } from '../../lib/Element';
import { PlainUtils } from '../../utils/PlainUtils';
import { XEvent } from '../../lib/XEvent';

const EL_POPUP_POSITION = {
  TOP: 1,
  LEFT: 2,
  BOTTOM: 3,
  RIGHT: 4,
};

let instances = [];
let root = null;

class ElPopUp extends Widget {

  constructor(options) {
    super(`${cssPrefix}-el-pop-up ${cssPrefix}-no-scroll-bar`);
    instances.push(this);
    this.off = true;
    this.options = PlainUtils.mergeDeep({
      el: PlainUtils.Nul,
      position: EL_POPUP_POSITION.BOTTOM,
      overflowY: false,
      overflowX: false,
      autoWidth: false,
      autoHeight: false,
    }, options);
    this.bind();
  }

  unbind() {
    XEvent.unbind(window);
  }

  bind() {
    XEvent.bind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, () => {
      this.position();
    });
  }

  autosize() {
    const { options } = this;
    this.css('height', 'auto');
    this.css('width', 'auto');
    const { top, left, width, height } = this.box();
    const maxWidth = window.innerWidth - left;
    const maxHeight = window.innerHeight - top;
    if (options.autoWidth) {
      if (width > maxWidth) {
        this.css('width', `${maxWidth}px`);
      } else {
        this.css('width', 'auto');
      }
    }
    if (options.autoHeight) {
      if (height > maxHeight) {
        this.css('height', `${maxHeight}px`);
      } else {
        this.css('height', 'auto');
      }
    }
    if (options.overflowX) {
      this.css('overflow-x', 'auto');
    } else {
      this.css('overflow-x', 'none');
    }
    if (options.overflowY) {
      this.css('overflow-y', 'auto');
    } else {
      this.css('overflow-y', 'none');
    }
  }

  position() {
    const { el, position } = this.options;
    const elBox = el.box();
    const contentBox = this.box();
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

  close() {
    if (this.off === false && root) {
      root.remove(this);
      this.off = true;
    }
  }

  open() {
    if (this.off && root) {
      root.children(this);
      this.position();
      this.autosize();
      this.off = false;
    }
  }

  toggle() {
    if (root) {
      if (this.off) {
        this.open();
      } else {
        this.close();
      }
    }
  }

  destroy() {
    super.destroy();
    this.unbind();
    ElPopUp.removeInstance(this);
  }

  static removeInstance(instance) {
    const filter = [];
    instances.forEach((item) => {
      if (item !== instance) {
        filter.push(item);
      }
    });
    instances = filter;
  }

  static closeAll(filter = []) {
    instances.forEach((item) => {
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
