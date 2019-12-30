import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { h } from '../../lib/Element';

class BottomMenu extends Widget {
  constructor() {
    super(`${cssPrefix}-bottom-menu`);
    this.sum = h('div', `${cssPrefix}-bottom-sum`);
    this.avg = h('div', `${cssPrefix}-bottom-avg`);
    this.number = h('div', `${cssPrefix}-bottom-number`);
    this.children(
      this.sum,
      this.avg,
      this.number,
    );
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
