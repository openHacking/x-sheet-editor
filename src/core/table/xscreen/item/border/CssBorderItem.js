import { BorderItem } from './BorderItem';
import { cssPrefix } from '../../../../../const/Constant';

class CssBorderItem extends BorderItem {

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
  CssBorderItem,
};
