import { XScreenBorderItem } from './XScreenBorderItem';
import { cssPrefix } from '../../../../const/Constant';

class XScreenCssBorderItem extends XScreenBorderItem {

  constructor({ table }) {
    super({ table }, `${cssPrefix}-part-border-css`);
    this.type = 'solid';
    this.setBorderType(this.type);
  }

  setBorderType(type) {
    this.type = type;
    this.blt.addClass(type);
    this.bl.addClass(type);
    this.bt.addClass(type);
    this.bbr.addClass(type);
  }

}

export {
  XScreenCssBorderItem,
};
