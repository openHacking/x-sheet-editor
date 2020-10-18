import { ELContextMenuItem } from '../../contextmenu/ELContextMenuItem';
import { Constant, cssPrefix } from '../../../const/Constant';
import { h } from '../../../lib/Element';
import { SearchInput } from '../../form/input/SearchInput';
import { ValueItem } from './ValueItem';
import { XEvent } from '../../../lib/XEvent';

class ValueFilter extends ELContextMenuItem {

  constructor() {
    super(`${cssPrefix}-filter-data-menu-item ${cssPrefix}-value-filter`);
    this.status = true;
    this.items = [];

    this.titleEle = h('div', `${cssPrefix}-value-filter-title`);
    this.titleTextEle = h('span', `${cssPrefix}-value-filter-title-text`);
    this.titleIconEle = h('span', `${cssPrefix}-value-filter-title-icon active`);
    this.titleTextEle.text('按值过滤');
    this.titleEle.children(this.titleIconEle);
    this.titleEle.children(this.titleTextEle);
    this.children(this.titleEle);

    this.optionBoxEle = h('div', `${cssPrefix}-value-filter-option-box`);
    this.selectEle = h('div', `${cssPrefix}-value-filter-option-select`);
    this.flagEle = h('div', `${cssPrefix}-value-filter-option-flag`);
    this.clearEle = h('div', `${cssPrefix}-value-filter-option-clear`);
    this.clearEle.text('清空');
    this.flagEle.html('&nbsp;-&nbsp;');
    this.selectEle.text('全选');
    this.optionBoxEle.children(this.selectEle);
    this.optionBoxEle.children(this.flagEle);
    this.optionBoxEle.children(this.clearEle);
    this.children(this.optionBoxEle);

    this.searchBoxEle = h('div', `${cssPrefix}-value-filter-input-box`);
    this.searchInput = new SearchInput();
    this.searchBoxEle.children(this.searchInput);
    this.children(this.searchBoxEle);

    this.itemsBox = h('div', `${cssPrefix}-value-filter-items-box`);
    this.children(this.itemsBox);

    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));
    this.addItem(new ValueItem({ text: '121212' }));

    this.removeClass('hover');
    this.show();
    this.bind();
  }

  addItem(valueItem) {
    this.items.push(valueItem);
    this.itemsBox.children(valueItem);
  }

  bind() {
    const {
      titleEle, titleIconEle, selectEle, clearEle,
    } = this;
    XEvent.bind(selectEle, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.selectAll();
    });
    XEvent.bind(clearEle, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.clearAll();
    });
    XEvent.bind(titleEle, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      if (this.status) {
        this.status = false;
        this.hide();
        titleIconEle.removeClass('active');
      } else {
        this.status = true;
        this.show();
        titleIconEle.addClass('active');
      }
    });
  }

  show() {
    this.status = true;
    this.optionBoxEle.show();
    this.searchBoxEle.show();
    this.itemsBox.show();
  }

  hide() {
    this.status = false;
    this.optionBoxEle.hide();
    this.searchBoxEle.hide();
    this.itemsBox.hide();
  }

  selectAll() {
    const { items } = this;
    items.forEach((item) => {
      item.select(true);
    });
  }

  clearAll() {
    const { items } = this;
    items.forEach((item) => {
      item.select(false);
    });
  }

}

export {
  ValueFilter,
};
