import { Widget } from '../../libs/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../libs/Element';
import { XEvent } from '../../libs/XEvent';
import { PlainUtils } from '../../utils/PlainUtils';
import { XSelectItem } from '../worktable/xscreenitems/xselect/XSelectItem';
import { Throttle } from '../../libs/Throttle';
import { SumTotalTask } from '../../task/SumTotalTask';

class WorkBookBottomMenu extends Widget {

  constructor(workBottom) {
    super(`${cssPrefix}-bottom-menu`);
    this.workBottom = workBottom;
    this.sum = h('div', `${cssPrefix}-bottom-sum`);
    this.avg = h('div', `${cssPrefix}-bottom-avg`);
    this.number = h('div', `${cssPrefix}-bottom-number`);
    this.fullScreen = h('div', `${cssPrefix}-bottom-full-screen`);
    this.grid = h('div', `${cssPrefix}-bottom-grid`);
    this.throttle = new Throttle({ time: 800 });
    this.totalTask = new SumTotalTask();
    // 表格数据迭代器
    this.children(this.grid);
    this.children(this.fullScreen);
    this.children(this.sum);
    this.children(this.avg);
    this.children(this.number);
  }

  onAttach() {
    this.bind();
  }

  unbind() {
    const { workBottom, grid, fullScreen } = this;
    const { work } = workBottom;
    const { body } = work;
    XEvent.unbind(grid);
    XEvent.unbind(fullScreen);
    XEvent.unbind(body);
  }

  bind() {
    const { workBottom, grid, fullScreen, throttle } = this;
    const { work } = workBottom;
    const { body } = work;
    const { sheetView } = body;
    XEvent.bind(body, Constant.WORK_BODY_EVENT_TYPE.CHANGE_ACTIVE, () => {
      throttle.action(() => {
        this.computer();
      });
    });
    XEvent.bind(body, Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, () => {
      throttle.action(() => {
        this.computer();
      });
    });
    XEvent.bind(body, Constant.TABLE_EVENT_TYPE.DATA_CHANGE, () => {
      throttle.action(() => {
        this.computer();
      });
    });
    XEvent.bind(fullScreen, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      if (PlainUtils.isFull()) {
        PlainUtils.exitFullscreen();
      } else {
        PlainUtils.fullScreen(work.root);
      }
    });
    XEvent.bind(grid, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.settings.table.showGrid = !table.settings.table.showGrid;
      table.render();
    });
  }

  async computer() {
    const { totalTask, workBottom } = this;
    const { work } = workBottom;
    const { body } = work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const data = table.getTableData();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    if (selectRange) {
      this.setSum('...');
      this.setAvg('...');
      this.setNumber('...');
      const { total, avg, number } = await totalTask.execute(selectRange, data);
      this.setSum(total);
      this.setAvg(avg);
      this.setNumber(number);
    } else {
      this.setSum(0);
      this.setAvg(0);
      this.setNumber(0);
    }
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

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { WorkBookBottomMenu };
