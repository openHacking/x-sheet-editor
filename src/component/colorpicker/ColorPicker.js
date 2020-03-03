import { h } from '../../lib/Element';
import { cssPrefix } from '../../config';
import { Widget } from '../../lib/Widget';
import { DragPanel } from '../dragpanel/DragPanel';

class ColorPicker extends Widget {
  constructor() {
    super(`${cssPrefix}-color-picker`);
    // 拖拽组件
    this.dragPanel = new DragPanel();
    // 头部
    this.preViewColorPoint = h('div', `${cssPrefix}-color-picker-pre-view-color-point`);
    this.colorValueTips = h('div', `${cssPrefix}-color-picker-color-value-tips`);
    this.colorInput = h('div', `${cssPrefix}-color-picker-color-input`);
    this.top = h('div', `${cssPrefix}-color-picker-top`);
    this.top.children(this.preViewColorPoint);
    this.top.children(this.colorValueTips);
    this.top.children(this.colorInput);
    // 中间部分
    this.selectColorPoint = h('div', `${cssPrefix}-color-picker-select-color-point`);
    this.selectColorArea = h('div', `${cssPrefix}-color-picker-select-color-area`);
    this.center = h('div', `${cssPrefix}-color-picker-center`);
    this.selectColorArea.children(this.selectColorPoint);
    this.center.children(this.selectColorArea);
    // 底部
    this.colorHuxTips = h('div', `${cssPrefix}-color-picker-color-hux-tips`);
    this.colorBar = h('div', `${cssPrefix}-color-picker-color-bar`);
    this.colorBarPoint = h('div', `${cssPrefix}-color-picker-bar-point`);
    this.bottom = h('div', `${cssPrefix}-color-picker-bottom`);
    this.colorBar.children(this.colorBarPoint);
    this.bottom.children(this.colorHuxTips);
    this.bottom.children(this.colorBar);
    // 按钮
    this.cancelButton = h('div', `${cssPrefix}-color-picker-cancel-button`);
    this.selectButton = h('div', `${cssPrefix}-color-picker-select-button`);
    this.buttons = h('div', `${cssPrefix}-color-picker-buttons`);
    this.buttons.children(this.cancelButton);
    this.buttons.children(this.selectButton);
    this.children(this.top);
    this.children(this.center);
    this.children(this.bottom);
    this.children(this.buttons);
    this.dragPanel.children(this);
  }

  open() {}

  close() {}
}

export { ColorPicker };
