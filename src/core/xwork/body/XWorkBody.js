/* global window */
import { Widget } from '../../../lib/Widget';
import { h } from '../../../lib/Element';
import { cssPrefix, Constant, XSheetVersion } from '../../../const/Constant';
import { VerticalLayer } from '../../../lib/layer/VerticalLayer';
import { HorizontalLayer } from '../../../lib/layer/HorizontalLayer';
import { VerticalLayerElement } from '../../../lib/layer/VerticalLayerElement';
import { ScrollBarX } from '../../../module/scrollbar/ScrollBarX';
import { ScrollBarY } from '../../../module/scrollbar/ScrollBarY';
import { HorizontalLayerElement } from '../../../lib/layer/HorizontalLayerElement';
import { VerticalCenterElement } from '../../../lib/layer/center/VerticalCenterElement';
import { VerticalCenter } from '../../../lib/layer/center/VerticalCenter';
import { XWorkSheetView } from './sheet/XWorkSheetView';
import { XWorkTabView } from './tab/XWorkTabView';
import { SheetUtils } from '../../../utils/SheetUtils';
import { XEvent } from '../../../lib/XEvent';
import { XWorkTab } from './tab/XWorkTab';
import { XWorkSheet } from './sheet/XWorkSheet';
import Download from '../../../lib/donwload/Download';
import { Throttle } from '../../../lib/Throttle';
import { XDraw } from '../../../draw/XDraw';
import { XWorkBodyKeyHandle } from './XWorkBodyKeyHandle';

const settings = {
  sheets: [],
};

/**
 * XWorkBody
 */
class XWorkBody extends Widget {

  /**
   * XWorkBody
   * @param work
   * @param options
   */
  constructor(work, options) {
    super(`${cssPrefix}-work-body`);
    this.options = SheetUtils.copy({}, settings, options);
    this.work = work;
    this.sheets = this.options.sheets;
    // 版本标识
    this.version = h('div', `${cssPrefix}-version-tips`);
    this.version.html(`<a target="_blank" href="https://gitee.com/eigi/x-sheet">${XSheetVersion}</a>`);
    this.children(this.version);
    // sheet表
    this.sheetViewLayer = new HorizontalLayerElement({
      style: {
        flexGrow: 1,
      },
    });
    // 垂直滚动条
    this.scrollBarYLayer = new HorizontalLayerElement({
      style: {
        overflow: 'inherit',
      },
    });
    // 水平滚动条
    this.scrollBarXLayer = new VerticalCenterElement();
    this.scrollBarXVerticalCenter = new VerticalCenter();
    this.scrollBarXHorizontalLayer = new HorizontalLayerElement({
      style: {
        flexGrow: 2,
      },
    });
    this.scrollBarXVerticalCenter.children(this.scrollBarXLayer);
    this.scrollBarXHorizontalLayer.children(this.scrollBarXVerticalCenter);
    // 选项卡
    this.sheetSwitchTabLayer = new HorizontalLayerElement({
      style: {
        flexGrow: 3,
      },
    });
    // 水平布局
    this.horizontalLayer1 = new HorizontalLayer();
    this.horizontalLayer2 = new HorizontalLayer();
    this.horizontalLayer1.children(this.sheetViewLayer);
    this.horizontalLayer1.children(this.scrollBarYLayer);
    this.horizontalLayer2.children(this.sheetSwitchTabLayer);
    this.horizontalLayer2.children(this.scrollBarXHorizontalLayer);
    // 根布局
    this.horizontalLayer1Layer = new VerticalLayerElement({
      style: {
        flexGrow: 1,
      },
    });
    this.horizontalLayer2Layer = new VerticalLayerElement();
    this.layerVerticalLayer = new VerticalLayer();
    this.horizontalLayer1Layer.children(this.horizontalLayer1);
    this.horizontalLayer2Layer.children(this.horizontalLayer2);
    this.layerVerticalLayer.children(this.horizontalLayer1Layer);
    this.layerVerticalLayer.children(this.horizontalLayer2Layer);
    this.children(this.layerVerticalLayer);
    // 组件
    this.sheetView = new XWorkSheetView();
    this.tabView = new XWorkTabView({
      onSwitch: (tab) => {
        const index = this.tabView.getIndexByTab(tab);
        this.setActiveIndex(index);
      },
      onAdd: () => {
        const tab = new XWorkTab();
        const sheet = new XWorkSheet(tab);
        this.addTabSheet(tab, sheet);
      },
    });
    this.scrollBarY = new ScrollBarY({
      scroll: (move) => {
        const sheet = this.sheetView.getActiveSheet();
        sheet.table.scrollY(move);
      },
      next: () => {
        const sheet = this.sheetView.getActiveSheet();
        if (SheetUtils.isUnDef(sheet)) return;
        const { table } = sheet;
        const scrollView = table.getScrollView();
        const { sri } = scrollView;
        const { rows } = table;
        const { scrollTo } = this.scrollBarY;
        const height = rows.getHeight(sri + 1);
        this.scrollBarY.scrollMove(scrollTo + height);
      },
      last: () => {
        const sheet = this.sheetView.getActiveSheet();
        if (SheetUtils.isUnDef(sheet)) return;
        const { table } = sheet;
        const scrollView = table.getScrollView();
        const { sri } = scrollView;
        const { rows } = table;
        const { scrollTo } = this.scrollBarY;
        const height = rows.getHeight(sri - 1);
        this.scrollBarY.scrollMove(scrollTo - height);
      },
    });
    this.scrollBarX = new ScrollBarX({
      scroll: (move) => {
        const sheet = this.sheetView.getActiveSheet();
        sheet.table.scrollX(move);
      },
      next: () => {
        const sheet = this.sheetView.getActiveSheet();
        if (SheetUtils.isUnDef(sheet)) return;
        const { table } = sheet;
        const scrollView = table.getScrollView();
        const { sci } = scrollView;
        const { cols } = table;
        const { scrollTo } = this.scrollBarX;
        const width = cols.getWidth(sci + 1);
        this.scrollBarX.scrollMove(scrollTo + width);
      },
      last: () => {
        const sheet = this.sheetView.getActiveSheet();
        if (SheetUtils.isUnDef(sheet)) return;
        const { table } = sheet;
        const scrollView = table.getScrollView();
        const { sci } = scrollView;
        const { cols } = table;
        const { scrollTo } = this.scrollBarX;
        const width = cols.getWidth(sci - 1);
        this.scrollBarX.scrollMove(scrollTo - width);
      },
    });
  }

  /**
   * 初始化Sheet
   */
  initializeSheet() {
    for (const item of this.sheets) {
      const { name } = item;
      const tab = new XWorkTab(name);
      const sheet = new XWorkSheet(tab, item);
      this.addTabSheet(tab, sheet);
    }
    this.setActiveIndex();
  }

  /**
   * 初始化
   */
  onAttach() {
    const { sheetSwitchTabLayer, scrollBarXLayer } = this;
    const { sheetViewLayer, scrollBarYLayer } = this;
    scrollBarYLayer.attach(this.scrollBarY);
    scrollBarXLayer.attach(this.scrollBarX);
    sheetSwitchTabLayer.attach(this.tabView);
    sheetViewLayer.attach(this.sheetView);
    this.bind();
    this.initializeSheet();
  }

  /**
   * 解绑事件处理
   */
  unbind() {
    XEvent.unbind(window);
    XEvent.unbind(this.sheetView);
  }

  /**
   * 绑定事件处理
   */
  bind() {
    const exploreInfo = SheetUtils.getExplorerInfo();
    const throttle = new Throttle();
    XEvent.bind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, () => {
      throttle.action(() => {
        XDraw.refresh();
        const table = this.getActiveTable();
        if (table) {
          const { xTableScrollView } = table;
          let scrollView = xTableScrollView.getScrollView();
          table.recache();
          table.reset();
          this.refreshScrollBarLocal();
          this.refreshScrollBarSize();
          table.resize();
          let { maxRi, maxCi } = xTableScrollView.getScrollMaxRiCi();
          if (scrollView.sri > maxRi) {
            table.scrollRi(maxRi);
            this.refreshScrollBarSize();
            this.refreshScrollBarLocal();
          }
          if (scrollView.sci > maxCi) {
            table.scrollCi(maxCi);
            this.refreshScrollBarSize();
            this.refreshScrollBarLocal();
          }
        }
      });
    });
    XEvent.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH, () => {
      this.refreshScrollBarLocal();
      this.refreshScrollBarSize();
    });
    XEvent.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT, () => {
      this.refreshScrollBarLocal();
      this.refreshScrollBarSize();
    });
    XEvent.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.REMOVE_ROW, () => {
      this.refreshScrollBarLocal();
      this.refreshScrollBarSize();
    });
    XEvent.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.REMOVE_COL, () => {
      this.refreshScrollBarLocal();
      this.refreshScrollBarSize();
    });
    XEvent.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.ADD_NEW_ROW, () => {
      this.refreshScrollBarLocal();
      this.refreshScrollBarSize();
    });
    XEvent.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.ADD_NEW_COL, () => {
      this.refreshScrollBarLocal();
      this.refreshScrollBarSize();
    });
    XEvent.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, () => {
      const table = this.getActiveTable();
      if (table) {
        this.refreshScrollBarLocal();
        this.refreshScrollBarSize();
      }
    });
    XEvent.bind(this.sheetView, Constant.SYSTEM_EVENT_TYPE.MOUSE_WHEEL, (e) => {
      const sheet = this.sheetView.getActiveSheet();
      if (SheetUtils.isUnDef(sheet)) return;
      const { table } = sheet;
      const { scroll, rows } = table;
      const scrollView = table.getScrollView();
      const { scrollTo } = this.scrollBarY;
      const { deltaY } = e;
      switch (exploreInfo.type) {
        case 'Chrome': {
          if (deltaY > 0) {
            this.scrollBarY.scrollMove(scrollTo + Math.abs(deltaY));
          } else {
            this.scrollBarY.scrollMove(scrollTo - Math.abs(deltaY));
          }
          break;
        }
        case 'Firefox': {
          if (deltaY > 0) {
            const dis = rows.getHeight(scrollView.sri + 1);
            this.scrollBarY.scrollMove(scrollTo + dis);
          } else {
            const dis = rows.getHeight(scrollView.sri - 1);
            this.scrollBarY.scrollMove(scrollTo - dis);
          }
          break;
        }
      }
      if (scroll.blockTop < scroll.maxBlockTop && scroll.blockTop > 0) {
        e.stopPropagation();
      }
      e.preventDefault();
    });
  }

  /**
   * 激活指定索引的sheet
   * @param index
   */
  setActiveIndex(index = 0) {
    const { sheetView } = this;
    const { tabView } = this;
    sheetView.setActiveByIndex(index);
    tabView.setActiveByIndex(index);
    const table = this.getActiveTable();
    if (table) {
      table.reset();
      this.refreshScrollBarLocal();
      this.refreshScrollBarSize();
      table.resize();
      this.trigger(Constant.WORK_BODY_EVENT_TYPE.CHANGE_ACTIVE);
    }
  }

  /**
   * 设置当前激活的sheet缩放比
   * @param value
   */
  setScale(value) {
    const { sheetView } = this;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    table.setScale(value);
    this.refreshScrollBarLocal();
    this.refreshScrollBarSize();
  }

  /**
   * 获取当前激活的sheet
   * @returns {*}
   */
  getActiveSheet() {
    return this.sheetView.getActiveSheet();
  }

  /**
   * 获取当前激活的tab
   * @returns {*}
   */
  getActiveTab() {
    return this.tabView.getActiveSheet();
  }

  /**
   * 获取当前激活的table
   * @returns {*}
   */
  getActiveTable() {
    const sheet = this.getActiveSheet();
    if (sheet) {
      return sheet.table;
    }
    return null;
  }

  /**
   * 添加一个新的 tab sheet
   * @param tab
   * @param sheet
   */
  addTabSheet(tab, sheet) {
    const { tabView } = this;
    const { sheetView } = this;
    const { table } = sheet;
    tabView.attach(tab);
    sheetView.attach(sheet);
    XWorkBodyKeyHandle.register({
      table, body: this,
    });
  }

  /**
   * 删除指定索引的sheet
   * @param index
   */
  removeByIndex(index) {
    const { tabView } = this;
    const { sheetView } = this;
    tabView.removeByIndex(index);
    sheetView.removeByIndex(index);
  }

  /**
   * 获取所有sheet的json数据
   */
  getAllSheetJson() {
    const { sheetView } = this;
    const { sheetList } = sheetView;
    sheetList.forEach((sheet) => {
      const { table, tab } = sheet;
      const { rows, cols, settings } = table;
      const merges = table.getTableMerges();
      const cells = table.getTableCells();
      const data = {
        name: tab.name,
        tableConfig: {
          table: {
            showGrid: settings.table.showGrid,
            background: settings.table.background,
          },
          merge: merges.getData(),
          rows: rows.getData(),
          cols: cols.getData(),
          data: cells.getData(),
        },
      };
      const text = `window['${tab.name}'] = ${JSON.stringify(data)}`;
      Download(text, `${tab.name}.js`, 'application/x-javascript');
    });
  }

  /**
   * 获取当前sheet的json数据
   */
  getActiveSheetJson() {
    const { sheetView } = this;
    const sheet = sheetView.getActiveSheet();
    if (sheet) {
      const { table, tab } = sheet;
      const { rows, cols, settings } = table;
      const merges = table.getTableMerges();
      const cells = table.getTableCells();
      const data = {
        name: tab.name,
        tableConfig: {
          table: {
            showGrid: settings.table.showGrid,
            background: settings.table.background,
          },
          merge: merges.getData(),
          rows: rows.getData(),
          cols: cols.getData(),
          data: cells.getData(),
        },
      };
      const text = `window['${tab.name}'] = ${JSON.stringify(data)}`;
      Download(text, `${tab.name}.js`, 'application/x-javascript');
    }
  }

  /**
   * 刷新滚动条大小
   */
  refreshScrollBarSize() {
    const table = this.getActiveTable();
    const {
      scrollBarXHorizontalLayer, scrollBarY, scrollBarX,
    } = this;
    // 获取表格大小
    const totalHeight = table.getScrollTotalHeight();
    const totalWidth = table.getScrollTotalWidth();
    // 是否显示水平滚动条
    if (totalWidth > table.getContentWidth()) {
      scrollBarXHorizontalLayer.show();
    } else {
      scrollBarXHorizontalLayer.hide();
    }
    // 调整滚动条尺寸
    scrollBarY.setSize(table.getContentHeight(), totalHeight);
    scrollBarX.setSize(table.getContentWidth(), totalWidth);
  }

  /**
   * 刷新滚动条位置
   */
  refreshScrollBarLocal() {
    const table = this.getActiveTable();
    this.scrollBarY.setLocal(table.getTop());
    this.scrollBarX.setLocal(table.getLeft());
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { XWorkBody };
