import { Widget } from '../../lib/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../lib/Element';
import { DragPanel } from '../dragpanel/DragPanel';
import { EventBind } from '../../utils/EventBind';

class Alert extends Widget {

  constructor({
    title = '提示',
    message = '',
  }) {
    super(`${cssPrefix}-alert`);
    // 创建 UI
    this.closeEle = h('div', `${cssPrefix}-alert-close`);
    this.titleEle = h('div', `${cssPrefix}-alert-title`);
    this.contentEle = h('div', `${cssPrefix}-alert-content`);
    this.okEle = h('div', `${cssPrefix}-alert-ok`);
    this.buttonsEle = h('div', `${cssPrefix}-alert-buttons`);
    // 显示内容消息
    this.contentEle.html(message);
    this.titleEle.html(title);
    this.okEle.html('确定');
    // 添加UI
    this.buttonsEle.children(this.okEle);
    this.children(this.closeEle);
    this.children(this.titleEle);
    this.children(this.contentEle);
    this.children(this.buttonsEle);
    // 拖拽组件
    this.dragPanel = new DragPanel().children(this);
    // 绑定事件
    this.bind();
  }

  bind() {
    EventBind.bind(this.okEle, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.close();
    });
  }

  open() {
    const { dragPanel } = this;
    dragPanel.open();
  }

  close() {
    const { dragPanel } = this;
    dragPanel.close();
  }

}

export {
  Alert,
};
