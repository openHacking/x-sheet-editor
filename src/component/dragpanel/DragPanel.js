/* global document */
import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { EventBind } from '../../utils/EventBind';

import { h } from '../../lib/Element';
import { Utils } from '../../utils/Utils';

const POOL = [];

let root = null;

const DRAG_PANEL_POSITION = {
  LEFT: 1,
  TOP: 2,
  RIGHT: 3,
  CENTER: 4,
};

class DragPanel extends Widget {

  constructor(options) {
    super(`${cssPrefix}-drag-panel`);
    this.options = Utils.mergeDeep({
      position: DRAG_PANEL_POSITION.CENTER,
    }, options);
    this.off = true;
    this.mask = h('div', `${cssPrefix}-drag-panel-mask`);
    this.content = h('div', `${cssPrefix}-drag-panel-content`);
    super.children(this.content);
    this.bind();
    POOL.push(this);
  }

  bind() {
    const { mask } = this;
    EventBind.bind(mask, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.close();
      e.stopPropagation();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (evt1) => {
      if (evt1.button !== 0) return;
      const downEventXy = this.computeEventXy(evt1, this);
      EventBind.mouseMoveUp(h(document), (evt2) => {
        // 计算移动的距离
        const top = evt2.pageY - downEventXy.y;
        const left = evt2.pageX - downEventXy.x;
        this.offset({ top, left });
        evt2.stopPropagation();
        evt2.preventDefault();
      });
      evt1.stopPropagation();
      evt1.preventDefault();
    });
  }

  position() {
    const { options } = this;
    const { position } = options;
    const { width, height } = Utils.viewPort();
    const box = this.box();
    switch (position) {
      case DRAG_PANEL_POSITION.LEFT:
        break;
      case DRAG_PANEL_POSITION.RIGHT:
        break;
      case DRAG_PANEL_POSITION.TOP:
        break;
      case DRAG_PANEL_POSITION.CENTER:
        this.offset({
          left: width / 2 - box.width / 2,
          top: height / 2 - box.height / 2,
        });
        break;
      default: break;
    }
    return this;
  }

  open() {
    if (this.off && root) {
      const { mask } = this;
      root.children(mask);
      root.children(this);
      this.position();
      this.off = false;
    }
    return this;
  }

  close() {
    if (this.off === false && root) {
      const { mask } = this;
      root.remove(this);
      root.remove(mask);
      this.off = true;
    }
    return this;
  }

  children(...args) {
    this.content.children(...args);
    return this;
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

export { DragPanel };
