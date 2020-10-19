/* global window */
import { Widget } from '../../lib/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../lib/Element';
import { PlainUtils } from '../../utils/PlainUtils';
import { XEvent } from '../../lib/XEvent';

let root = PlainUtils.Nul;
let instances = [];

/**
 * ElPopUp
 * @author jerry
 * @date 2020/10/19
 */
class ElPopUp extends Widget {

  /**
   * ElPopUp
   * @param options
   */
  constructor(options) {
    super(`${cssPrefix}-el-pop-up ${cssPrefix}-no-scroll-bar`);
    this.options = PlainUtils.mergeDeep({
      el: PlainUtils.Nul,
      autosize: false,
      position: ElPopUp.POPUP_POSTION.TB,
    }, options);
    this.direction = PlainUtils.Undef;
    this.status = false;
    this.location = 0;
    this.spaces = 0;
    this.elPopUpResizeHandle = () => {
      this.elPopUpPosition();
      this.elPopUpAutosize();
      this.elPopUpLocation();
    };
    instances.push(this);
  }

  /**
   * 显示弹框
   */
  open() {
    if (this.status === false && root) {
      root.children(this);
      this.elPopUpPosition();
      this.elPopUpAutosize();
      this.elPopUpLocation();
      this.status = true;
    }
  }

  /**
   * 关闭弹框
   */
  close() {
    if (this.status === true && root) {
      root.remove(this);
      this.status = false;
    }
  }

  /**
   * 卸载事件
   */
  unbind() {
    XEvent.unbind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, this.elPopUpResizeHandle);
  }

  /**
   * 绑定事件
   */
  bind() {
    XEvent.bind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, this.elPopUpResizeHandle);
  }

  /**
   * 计算显示的大小
   */
  elPopUpAutosize() {
    const { options, direction, spaces } = this;
    const { autosize } = options;
    const box = this.box();
    const { width, height } = box;
    if (autosize) {
      this.css('width', 'initial');
      this.css('height', 'initial');
      switch (direction) {
        case 'top':
        case 'bottom':
          if (height > spaces) {
            this.css('height', `${spaces}px`);
          }
          break;
        case 'left':
        case 'right':
          if (width > spaces) {
            this.css('width', `${spaces}px`);
          }
          break;
      }
    }
  }

  /**
   * 计算显示的位置
   */
  elPopUpPosition() {
    const { options } = this;
    const { position } = options;
    const { el } = options;
    const elBox = el.box();
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    this.direction = PlainUtils.Undef;
    this.spaces = 0;
    this.location = 0;
    switch (position) {
      case ElPopUp.POPUP_POSTION.LR: {
        const width = elBox.width;
        const elLeft = elBox.left;
        const leftDiff = elLeft;
        const rightDiff = winWidth - (elLeft + width);
        if (leftDiff > rightDiff) {
          this.direction = 'left';
          this.spaces = leftDiff;
          this.location = elLeft;
        } else {
          this.direction = 'right';
          this.spaces = rightDiff;
          this.location = elLeft + width;
        }
        break;
      }
      case ElPopUp.POPUP_POSTION.TB: {
        const height = elBox.height;
        const elTop = elBox.top;
        const topDiff = elTop;
        const bottomDIff = winHeight - (elTop + height);
        if (topDiff > bottomDIff) {
          this.direction = 'top';
          this.spaces = topDiff;
          this.location = elTop;
        } else {
          this.direction = 'bottom';
          this.spaces = bottomDIff;
          this.location = elTop + height;
        }
        break;
      }
    }
  }

  /**
   * 设置显示位置
   */
  elPopUpLocation() {
    const { direction, location } = this;
    const box = this.box();
    const { width, height } = box;
    switch (direction) {
      case 'left':
        this.css('left', `${location - width}px`);
        break;
      case 'right':
        this.css('left', `${location}px`);
        break;
      case 'top':
        this.css('top', `${location - height}px`);
        break;
      case 'bottom':
        this.css('top', `${location}px`);
        break;
    }
  }

  /**
   * 销毁组件
   */
  destroy() {
    super.destroy();
    this.unbind();
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
ElPopUp.POPUP_POSTION = {
  TB: Symbol('上下位置'),
  LR: Symbol('左右位置'),
};

export {
  ElPopUp,
};
