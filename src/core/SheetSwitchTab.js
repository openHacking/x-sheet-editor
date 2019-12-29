import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { h } from '../lib/Element';
import { Utils } from '../utils/Utils';
import { Tab } from './Tab';

class SheetSwitchTab extends Widget {
  constructor(options) {
    super(`${cssPrefix}-sheet-switch-tab`);
    this.last = h('div', `${cssPrefix}-switch-tab-last-btn`);
    this.next = h('div', `${cssPrefix}-switch-tab-next-btn`);
    this.content = h('div', `${cssPrefix}-sheet-tab-content`);
    this.tabs = h('div', `${cssPrefix}-sheet-tab-tabs`);
    this.plus = h('div', `${cssPrefix}-sheet-tab-plus`);
    this.content.children(this.tabs);
    this.children(...[
      this.last,
      this.next,
      this.content,
      this.plus,
    ]);
    this.optiions = Utils.mergeDeep({
      onAdd(tab) { return tab; },
      onSwitch(tab) { return tab; },
    }, options);
    this.number = 0;
    this.left = null;
    this.tabList = [];
  }

  setActiveTab(index) {
    const { tabList } = this;
    if (tabList[index]) {
      this.setActive(tabList[index]);
      return tabList[index];
    }
    return null;
  }

  setActive(tab) {
    tab.addClass('active');
    tab.sibling().forEach((item) => {
      item.removeClass('active');
    });
  }

  init() {
    this.bind();
  }

  bind() {
    this.plus.on('click', () => {
      const tab = new Tab();
      const index = this.add(tab);
      this.optiions.onAdd(tab, index);
    });
    this.last.on('click', () => {
      if (this.left !== null) {
        this.left += 30;
        this.left = this.left >= 0 ? 0 : this.left;
        this.tabs.css('marginLeft', `${this.left}px`);
      }
    });
    this.next.on('click', () => {
      if (this.left !== null) {
        const maxWidth = this.content.offset().width;
        const current = this.tabs.offset().width;
        const min = -(current - maxWidth);
        this.left -= 30;
        this.left = this.left <= min ? min : this.left;
        this.tabs.css('marginLeft', `${this.left}px`);
      }
    });
  }

  add(tab) {
    this.tabList.push(tab);
    this.tabs.children(tab);
    tab.on('click', () => {
      this.setActive(tab);
      this.optiions.onSwitch(tab);
    });
    const maxWidth = this.content.offset().width;
    const current = this.tabs.offset().width;
    if (current > maxWidth) {
      this.left = -(current - maxWidth);
      this.tabs.css('marginLeft', `${this.left}px`);
    }
    return this.tabList.length - 1;
  }
}

export { SheetSwitchTab };
