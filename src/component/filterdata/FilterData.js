import { Constant, cssPrefix } from '../../const/Constant';
import { ELContextMenu } from '../contextmenu/ELContextMenu';
import { OrderAZ } from './OrderAZ';
import { OrderZA } from './OrderZA';
import { IFFilter } from './IFFilter';
import { ValueFilter } from './valuefilter/ValueFilter';
import { h } from '../../lib/Element';
import { ELContextMenuDivider } from '../contextmenu/ELContextMenuDivider';
import { XEvent } from '../../lib/XEvent';
import { PlainUtils } from '../../utils/PlainUtils';
import { ElPopUp } from '../elpopup/ElPopUp';

class FilterData extends ELContextMenu {

  constructor(options) {
    super(`${cssPrefix}-filter-data-menu`, PlainUtils.mergeDeep({
      ok: () => {},
      no: () => {},
    }, options));
    this.valueFilter = new ValueFilter();
    this.ifFilter = new IFFilter();
    this.orderAz = new OrderAZ();
    this.orderZa = new OrderZA();
    this.okEle = h('div', `${cssPrefix}-filter-data-menu-button ${cssPrefix}-filter-data-menu-ok`);
    this.noEle = h('div', `${cssPrefix}-filter-data-menu-button ${cssPrefix}-filter-data-menu-no`);
    this.children(this.orderAz);
    this.children(this.orderZa);
    this.children(new ELContextMenuDivider());
    this.children(this.ifFilter);
    this.children(this.valueFilter);
    this.children(new ELContextMenuDivider());
    this.children(this.noEle);
    this.children(this.okEle);
    this.okEle.html('确定');
    this.noEle.html('取消');
    this.okHandle = () => {
      const { ifFilter, valueFilter } = this;
      const valueFilterItems = valueFilter.getSelectItems();
      const valueFilterValue = valueFilter.getValue();
      const ifFilterType = ifFilter.getType();
      const ifFilterValue = ifFilter.getValue();
      this.options.ok({
        valueFilterItems, valueFilterValue, ifFilterType, ifFilterValue,
      });
      this.close();
    };
    this.noHandle = () => {
      this.options.no();
      this.close();
    };
    this.filterDataHandle = () => {
      ElPopUp.closeAll([this.elPopUp]);
    };
    this.bind();
  }

  unbind() {
    XEvent.unbind(this.okEle);
    XEvent.unbind(this.noEle);
  }

  bind() {
    XEvent.bind(this.okEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.okHandle);
    XEvent.bind(this.noEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.noHandle);
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.filterDataHandle);
  }

  open() {
    super.open();
  }

  destroy() {
    super.destroy();
    this.unbind();
    this.valueFilter.destroy();
    this.ifFilter.destroy();
  }

}

export {
  FilterData,
};
