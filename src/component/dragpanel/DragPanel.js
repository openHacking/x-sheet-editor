/* global document */
import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { EventBind } from '../../utils/EventBind';
import { Constant } from '../../utils/Constant';
import { h } from '../../lib/Element';

class DragPanel extends Widget {
  constructor(className = '') {
    super(`${cssPrefix}-drag-panel ${className}`);
    this.bind();
  }

  bind() {
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (evt1) => {
      const downEventXy = this.computeEventXy(evt1, this);
      EventBind.mouseMoveUp(h(document), (evt2) => {
        // 计算移动的距离
        const top = evt2.pageY - downEventXy.y;
        const left = evt2.pageX - downEventXy.x;
        this.offset({ top, left });
        evt2.stopPropagation();
        evt2.preventDefault();
      });
    });
  }

  open() {}

  close() {}
}

export { DragPanel };
