import { ELContextMenu } from '../../../../../component/elcontextmenu/ELContextMenu';
import { cssPrefix } from '../../../../../config';
import { Utils } from '../../../../../utils/Utils';
import { TextWrappingIcon1 } from '../icon/textwrapping/TextWrappingIcon1';
import { TextWrappingIcon2 } from '../icon/textwrapping/TextWrappingIcon2';
import { TextWrappingIcon3 } from '../icon/textwrapping/TextWrappingIcon3';
import { h } from '../../../../../lib/Element';
import { TextWrappingContextMenuItem } from './TextWrappingContextMenuItem';
import { EventBind } from '../../../../../utils/EventBind';
import { Constant } from '../../../../../utils/Constant';
import { TEXT_WRAP } from '../../../../../canvas/Font';

class TextWrappingContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-text-wrapping-context-menu`, Utils.mergeDeep({
      onUpdate: () => {},
    }, options));
    this.textWrappingIcon1 = new TextWrappingIcon1();
    this.textWrappingIcon2 = new TextWrappingIcon2();
    this.textWrappingIcon3 = new TextWrappingIcon3();
    const div2 = h('div', `${cssPrefix}-text-wrapping-context-menu-type-icon-line`);
    div2.children(this.textWrappingIcon1);
    div2.children(this.textWrappingIcon2);
    div2.children(this.textWrappingIcon3);
    this.textWrappingIcons = new TextWrappingContextMenuItem();
    this.textWrappingIcons.removeClass('hover');
    this.textWrappingIcons.children(div2);
    this.addItem(this.textWrappingIcons);
    // 添加事件
    EventBind.bind(this.textWrappingIcon1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(TEXT_WRAP.TRUNCATE);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.textWrappingIcon2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(TEXT_WRAP.OVER_FLOW);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.textWrappingIcon3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(TEXT_WRAP.WORD_WRAP);
      e.stopPropagation();
      e.preventDefault();
    });
  }
}

export { TextWrappingContextMenu };
