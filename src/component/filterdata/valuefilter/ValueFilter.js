import { ELContextMenuItem } from '../../contextmenu/ELContextMenuItem';
import { Constant, cssPrefix } from '../../../const/Constant';
import { h } from '../../../lib/Element';
import { SearchInput } from '../../form/input/SearchInput';
import { XEvent } from '../../../lib/XEvent';
import { w } from '../../../lib/Widget';

/**
 * ValueFilter
 */
class ValueFilter extends ELContextMenuItem {

  /**
   * ValueFilter
   */
  constructor() {
    super(`${cssPrefix}-filter-data-menu-item ${cssPrefix}-value-filter`);
    this.items = [];
    this.status = true;
    // 标题
    this.titleEle = h('div', `${cssPrefix}-value-filter-title`);
    this.titleTextEle = h('span', `${cssPrefix}-value-filter-title-text`);
    this.titleIconEle = h('span', `${cssPrefix}-value-filter-title-icon`);
    this.titleTextEle.text('按值过滤');
    this.titleEle.children(this.titleIconEle);
    this.titleEle.children(this.titleTextEle);
    this.children(this.titleEle);
    // 操作按钮
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
    // 搜索框
    this.searchBoxEle = h('div', `${cssPrefix}-value-filter-input-box`);
    this.searchInput = new SearchInput();
    this.searchBoxEle.children(this.searchInput);
    this.children(this.searchBoxEle);
    // 条目盒子
    this.itemsBox = h('div', `${cssPrefix}-value-filter-items-box`);
    this.children(this.itemsBox);
    // 事件处理
    this.hide();
    this.bind();
    this.removeClass('hover');
  }

  /**
   * 添加单项
   * @param valueItem
   */
  addItem(valueItem) {
    valueItem.setIndex(this.items.length);
    this.items.push(valueItem);
    this.itemsBox.children(valueItem);
  }

  /**
   * 卸载事件
   */
  unbind() {
    const {
      titleEle, selectEle, clearEle,
    } = this;
    XEvent.unbind(selectEle);
    XEvent.unbind(clearEle);
    XEvent.unbind(titleEle);
  }

  /**
   * 绑定事件
   */
  bind() {
    const { titleEle, selectEle, clearEle } = this;
    const { itemsBox } = this;
    const clazz = `${cssPrefix}-value-filter-item`;
    XEvent.bind(selectEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.selectAll();
    });
    XEvent.bind(titleEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      if (this.status) {
        this.hide();
      } else {
        this.show();
      }
    });
    XEvent.bind(itemsBox, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { items } = this;
      const { target } = e;
      const ele = w(target).closestClass(clazz);
      if (ele) {
        const index = ele.attr(`${cssPrefix}-value-filter-item-index`);
        const item = items[index];
        item.setStatus(!item.status);
      }
    });
    XEvent.bind(clearEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.clearAll();
    });
  }

  /**
   * 显示控件
   */
  show() {
    this.titleIconEle.addClass('active');
    this.status = true;
    this.optionBoxEle.show();
    this.searchBoxEle.show();
    this.itemsBox.show();
    return this;
  }

  /**
   * 隐藏控件
   */
  hide() {
    this.titleIconEle.removeClass('active');
    this.status = false;
    this.optionBoxEle.hide();
    this.searchBoxEle.hide();
    this.itemsBox.hide();
    return this;
  }

  /**
   * 选中所有子项
   */
  selectAll() {
    const { items } = this;
    items.forEach((item) => {
      item.setStatus(true);
    });
  }

  /**
   * 清除所有子项
   */
  clearAll() {
    const { items } = this;
    items.forEach((item) => {
      item.setStatus(false);
    });
  }

  /**
   * 清空内容
   */
  emptyAll() {
    this.itemsBox.html('');
    this.items = [];
  }

  /**
   * 销毁组件
   */
  destroy() {
    super.destroy();
    this.unbind();
    this.searchInput.destroy();
  }

}

export {
  ValueFilter,
};
