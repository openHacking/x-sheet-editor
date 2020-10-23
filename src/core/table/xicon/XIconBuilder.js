import { XIcon } from './XIcon';
import { XIconFocus } from './XIconFocus';

/**
 * XIconBuilder
 */
class XIconBuilder {

  /**
   * 图标事件处理
   * @param type
   * @param x
   * @param y
   * @param icons
   * @param native
   */
  xIconsEvent({
    type, x, y, icons, native,
  }) {
    if (icons.length > 0) {
      icons.forEach((icon) => {
        icon.eventHandle({
          type, x, y, native,
        });
      });
    } else {
      this.clearFocus();
    }
  }

  /**
   * 清空焦点元素
   */
  clearFocus() {
    const { focus } = this;
    const { activate } = focus;
    if (activate) {
      focus.setActivate(null);
      activate.onLeave();
    }
  }

  /**
   * XIconBuilder
   * @param focus
   */
  constructor({
    focus = new XIconFocus(),
  } = {}) {
    this.focus = focus;
  }

  /**
   * 构建小图标
   * @param options
   * @returns {XIcon}
   */
  build(options = {}) {
    const { focus } = this;
    const xIcon = new XIcon(options);
    xIcon.setFocus(focus);
    return xIcon;
  }

}

export {
  XIconBuilder,
};
