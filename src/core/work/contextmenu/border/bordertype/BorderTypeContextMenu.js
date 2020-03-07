import { ELContextMenu } from '../../../../../component/elcontextmenu/ELContextMenu';
import { cssPrefix } from '../../../../../config';
import { Utils } from '../../../../../utils/Utils';
import { BorderTypeContextMenuItem } from './BorderTypeContextMenuItem';
import { ELContextMenuDivider } from '../../../../../component/elcontextmenu/ELContextMenuDivider';
import { h } from '../../../../../lib/Element';
import { BorderIcon1 } from '../../../tools/border/BorderIcon1';
import { BorderIcon2 } from '../../../tools/border/BorderIcon2';
import { BorderIcon3 } from '../../../tools/border/BorderIcon3';
import { BorderIcon4 } from '../../../tools/border/BorderIcon4';
import { BorderIcon5 } from '../../../tools/border/BorderIcon5';
import { BorderIcon6 } from '../../../tools/border/BorderIcon6';
import { BorderIcon7 } from '../../../tools/border/BorderIcon7';
import { BorderIcon8 } from '../../../tools/border/BorderIcon8';
import { BorderIcon9 } from '../../../tools/border/BorderIcon9';
import { BorderIcon10 } from '../../../tools/border/BorderIcon10';
import { BorderColor } from '../../../tools/border/BorderColor';
import { BorderType } from '../../../tools/border/BorderType';
import { EventBind } from '../../../../../utils/EventBind';
import { Constant } from '../../../../../utils/Constant';
import { EL_POPUP_POSITION, ElPopUp } from '../../../../../component/elpopup/ElPopUp';
import { BorderColorContextMenu } from '../bordercolor/BorderColorContextMenu';
import { LineTypeContextMenu } from '../linetype/LineTypeContextMenu';

class BorderTypeContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-border-type-context-menu`, Utils.mergeDeep({
      onUpdate: () => {},
    }, options));
    this.type = null;
    this.color = null;
    // 边框样式
    this.borderIcon1 = new BorderIcon1();
    this.borderIcon2 = new BorderIcon2();
    this.borderIcon3 = new BorderIcon3();
    this.borderIcon4 = new BorderIcon4();
    this.borderIcon5 = new BorderIcon5();
    const div1 = h('div', `${cssPrefix}-border-type-context-menu-type-icon-line`);
    div1.children(this.borderIcon1);
    div1.children(this.borderIcon2);
    div1.children(this.borderIcon3);
    div1.children(this.borderIcon4);
    div1.children(this.borderIcon5);
    this.borderIcon6 = new BorderIcon6();
    this.borderIcon7 = new BorderIcon7();
    this.borderIcon8 = new BorderIcon8();
    this.borderIcon9 = new BorderIcon9();
    this.borderIcon10 = new BorderIcon10();
    const div2 = h('div', `${cssPrefix}-border-type-context-menu-type-icon-line`);
    div2.children(this.borderIcon6);
    div2.children(this.borderIcon7);
    div2.children(this.borderIcon8);
    div2.children(this.borderIcon9);
    div2.children(this.borderIcon10);
    this.borderIcons = new BorderTypeContextMenuItem();
    this.borderIcons.removeClass('hover');
    this.borderIcons.children(div1);
    this.borderIcons.children(div2);
    // 子菜单
    this.borderColor = new BorderColor();
    this.borderType = new BorderType();
    const div3 = h('div', `${cssPrefix}-border-type-context-menu-type-icon-line`);
    div3.children(this.borderColor);
    div3.children(this.borderType);
    this.borderColorAndType = new BorderTypeContextMenuItem();
    this.borderColorAndType.removeClass('hover');
    this.borderColorAndType.children(div3);
    // 追加子菜单
    this.addItem(this.borderIcons);
    this.addItem(new ELContextMenuDivider());
    this.addItem(this.borderColorAndType);
    // 边框颜色菜单
    this.borderColorContextMenu = new BorderColorContextMenu(Utils.copyProp({
      el: this.borderColor,
      position: EL_POPUP_POSITION.BOTTOM,
    }, {
      onUpdate: (color) => {
        this.color = color;
        this.borderColor.setColor(color);
      },
    }));
    // 边框类型
    this.lineTypeContextMenu = new LineTypeContextMenu(Utils.copyProp({
      el: this.borderType,
      position: EL_POPUP_POSITION.BOTTOM,
    }, {
      onUpdate: (type) => {
        this.type = type;
      },
    }));
    // 添加事件
    EventBind.bind(this.borderColor, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { borderColorContextMenu } = this;
      const { elPopUp } = borderColorContextMenu;
      ElPopUp.closeAll([elPopUp, this.elPopUp]);
      if (borderColorContextMenu.isOpen()) {
        borderColorContextMenu.open();
      } else {
        borderColorContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.borderType, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { lineTypeContextMenu } = this;
      const { elPopUp } = lineTypeContextMenu;
      ElPopUp.closeAll([elPopUp, this.elPopUp]);
      if (lineTypeContextMenu.isOpen()) {
        lineTypeContextMenu.open();
      } else {
        lineTypeContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.borderIcon1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border1', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.borderIcon2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border2', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.borderIcon3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border3', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.borderIcon4, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border4', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.borderIcon5, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border5', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.borderIcon6, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border6', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.borderIcon7, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border7', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.borderIcon8, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border8', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.borderIcon9, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border9', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.borderIcon10, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border10', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
  }
}

export { BorderTypeContextMenu };
