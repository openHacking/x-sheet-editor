import { ELContextMenu } from '../../../../../component/contextmenu/ELContextMenu';
import { FontAngleContextMenuItem } from './FontAngleContextMenuItem';
import { FontAngleDivider } from '../icon/fontangle/FontAngleDivider';
import { h } from '../../../../../lib/Element';
import { FontAngleValue } from '../../FontAngleValue';
import { cssPrefix } from '../../../../../const/Constant';
import { PlainUtils } from '../../../../../utils/PlainUtils';
import { FontAngle1 } from '../icon/fontangle/FontAngle1';
import { FontAngle2 } from '../icon/fontangle/FontAngle2';
import { FontAngle3 } from '../icon/fontangle/FontAngle3';
import { FontAngle4 } from '../icon/fontangle/FontAngle4';
import { FontAngle5 } from '../icon/fontangle/FontAngle5';
import { FontAngle6 } from '../icon/fontangle/FontAngle6';

class FontAngleContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-font-angle-context-menu`, PlainUtils.mergeDeep({
      onUpdate: () => {},
    }, options));
    const div1 = h('div', `${cssPrefix}-font-angle-context-menu-type-icon-line`);
    this.angle1 = new FontAngle1();
    this.angle2 = new FontAngle2();
    this.angle3 = new FontAngle3();
    this.angle4 = new FontAngle4();
    this.angle5 = new FontAngle5();
    this.angle6 = new FontAngle6();
    this.input = new FontAngleValue();
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
  }

  destroy() {
    super.destroy();
    this.input.destroy();
  }

}

export {
  FontAngleContextMenu,
};
