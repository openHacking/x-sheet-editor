import { Widget } from '../../lib/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../lib/Element';
import { EventBind } from '../../utils/EventBind';

class BottomMenu extends Widget {
  constructor(workBottom) {
    super(`${cssPrefix}-bottom-menu`);
    this.workBottom = workBottom;
    this.sum = h('div', `${cssPrefix}-bottom-sum`);
    this.avg = h('div', `${cssPrefix}-bottom-avg`);
    this.number = h('div', `${cssPrefix}-bottom-number`);
    this.grid = h('grid', `${cssPrefix}-bottom-grid`);
    this.children(this.grid);
    this.children(this.sum);
    this.children(this.avg);
    this.children(this.number);
  }

  onAttach() {
    this.bind();
  }

  bind() {
    const { workBottom } = this;
    const { work } = workBottom;
    const { body } = work;
    const { sheetView } = body;
    EventBind.bind(this.grid, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.settings.table.showGrid = !table.settings.table.showGrid;
      table.render();
    });
  }

  setSum(val) {
    this.sum.text(`求和: ${val}`);
  }

  setAvg(val) {
    this.avg.text(`平均数: ${val}`);
  }

  setNumber(val) {
    this.number.text(`数量: ${val}`);
  }
}

export { BottomMenu };
