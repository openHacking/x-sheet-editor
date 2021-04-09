import { ELContextMenu } from '../../../../../component/contextmenu/ELContextMenu';
import { FontAngleContextMenuItem } from './FontAngleContextMenuItem';
import { FontAngleDivider } from '../icon/fontangle/FontAngleDivider';
import { h } from '../../../../../libs/Element';
import { FontAngleValue } from '../../FontAngleValue';
import { Constant, cssPrefix } from '../../../../../const/Constant';
import { PlainUtils } from '../../../../../utils/PlainUtils';
import { FontAngle1 } from '../icon/fontangle/FontAngle1';
import { FontAngle2 } from '../icon/fontangle/FontAngle2';
import { FontAngle3 } from '../icon/fontangle/FontAngle3';
import { FontAngle4 } from '../icon/fontangle/FontAngle4';
import { FontAngle5 } from '../icon/fontangle/FontAngle5';
import { FontAngle6 } from '../icon/fontangle/FontAngle6';
import { XEvent } from '../../../../../libs/XEvent';
import { BaseFont } from '../../../../../canvas/font/BaseFont';

class FontAngleContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-font-angle-context-menu`, PlainUtils.copy({
      onUpdateAngle: () => {},
      onUpdateType: () => {},
    }, options));
    const div1 = h('div', `${cssPrefix}-font-angle-context-menu-type-icon-line`);
    this.angle1 = new FontAngle1();
    this.angle2 = new FontAngle2();
    this.angle3 = new FontAngle3();
    this.angle4 = new FontAngle4();
    this.angle5 = new FontAngle5();
    this.angle6 = new FontAngle6();
    this.input = new FontAngleValue({
      onChange: (angle) => {
        this.options.onUpdateAngle(angle);
      },
    });
    div1.children(this.angle1);
    div1.children(this.angle2);
    div1.children(new FontAngleDivider());
    div1.children(this.angle4);
    div1.children(this.angle3);
    div1.children(this.angle6);
    div1.children(this.angle5);
    div1.children(new FontAngleDivider());
    div1.children(this.input);
    this.item = new FontAngleContextMenuItem();
    this.item.children(div1);
    this.item.removeClass('hover');
    this.addItem(this.item);
    this.bind();
  }

  unbind() {
    const { angle1, angle2, angle3, angle4, angle5, angle6 } = this;
    XEvent.unbind(angle1);
    XEvent.unbind(angle2);
    XEvent.unbind(angle3);
    XEvent.unbind(angle4);
    XEvent.unbind(angle5);
    XEvent.unbind(angle6);
  }

  bind() {
    const { angle1, angle2, angle3, angle4, angle5, angle6 } = this;
    XEvent.bind(angle1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.options.onUpdateType(BaseFont.TEXT_DIRECTION.HORIZONTAL);
    });
    XEvent.bind(angle2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.options.onUpdateType(BaseFont.TEXT_DIRECTION.VERTICAL);
    });
    XEvent.bind(angle3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.options.onUpdateAngle(-45);
    });
    XEvent.bind(angle4, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.options.onUpdateAngle(45);
    });
    XEvent.bind(angle5, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.options.onUpdateAngle(-90);
    });
    XEvent.bind(angle6, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.options.onUpdateAngle(90);
    });
  }

  setValue(value) {
    if (!PlainUtils.isNumber(value)) {
      value = 0;
    }
    this.input.setValue(value);
  }

  destroy() {
    super.destroy();
    this.unbind();
    this.input.destroy();
  }

}

export {
  FontAngleContextMenu,
};
