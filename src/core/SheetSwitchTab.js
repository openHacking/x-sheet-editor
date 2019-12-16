import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { h } from '../lib/Element';

class SheetSwitchTab extends Widget {
  constructor() {
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
    this.number = 0;
    this.left = null;
  }

  createTab(name) {
    const tab = h('div', `${cssPrefix}-sheet-tab`);
    tab.on('click', () => this.activeTab(tab));
    tab.text(name);
    return tab;
  }

  activeTab(tab) {
    tab.addClass('active');
    tab.sibling().forEach((item) => {
      item.removeClass('active');
    });
  }

  init() {
    this.plus.on('click', () => {
      this.add();
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

  add(name = `${this.number += 1}-tab`) {
    this.tabs.children(this.createTab(name));
    const maxWidth = this.content.offset().width;
    const current = this.tabs.offset().width;
    if (current > maxWidth) {
      this.left = -(current - maxWidth);
      this.tabs.css('marginLeft', `${this.left}px`);
    }
  }
}

export { SheetSwitchTab };
