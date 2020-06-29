/* global window */
import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../constant/Constant';
import { VerticalLayer } from '../../lib/layer/VerticalLayer';
import { HorizontalLayer } from '../../lib/layer/HorizontalLayer';
import { VerticalLayerElement } from '../../lib/layer/VerticalLayerElement';
import { ScrollBarX } from '../../component/scrollbar/ScrollBarX';
import { ScrollBarY } from '../../component/scrollbar/ScrollBarY';
import { HorizontalLayerElement } from '../../lib/layer/HorizontalLayerElement';
import { VerticalCenterElement } from '../../lib/layer/center/VerticalCenterElement';
import { VerticalCenter } from '../../lib/layer/center/VerticalCenter';

import { SheetView } from './SheetView';
import { TabView } from './TabView';
import { Utils } from '../../utils/Utils';
import { EventBind } from '../../utils/EventBind';
import { h } from '../../lib/Element';
import { Tab } from './Tab';
import { Sheet } from './Sheet';

class WorkBody extends Widget {

  constructor(work, options = { sheets: [] }) {
    super(`${cssPrefix}-work-body`);
    this.work = work;
    this.workConfig = options;
    this.sheets = this.workConfig.sheets;
    this.tabSheet = [];

    // 版本标识
    this.poweredBy = h('div', `${cssPrefix}-powered-by-tips`);
    this.poweredBy.text(' X-Sheet 1.0.1-development ');
    this.children(this.poweredBy);

    // sheet表
    this.sheetViewLayer = new HorizontalLayerElement({ style: { flexGrow: 1 } });

    // 垂直滚动条
    this.scrollBarYLayer = new HorizontalLayerElement({ style: { overflow: 'inherit' } });

    // 水平滚动条
    this.scrollBarXLayer = new VerticalCenterElement();
    this.scrollBarXVerticalCenter = new VerticalCenter();
    this.scrollBarXHorizontalLayer = new HorizontalLayerElement({ style: { flexGrow: 2 } });
    this.scrollBarXVerticalCenter.children(this.scrollBarXLayer);
    this.scrollBarXHorizontalLayer.children(this.scrollBarXVerticalCenter);

    // 选修卡
    this.sheetSwitchTabLayer = new HorizontalLayerElement({ style: { flexGrow: 3 } });

    // 水平布局
    this.horizontalLayer1 = new HorizontalLayer();
    this.horizontalLayer2 = new HorizontalLayer();
    this.horizontalLayer1.children(this.sheetViewLayer);
    this.horizontalLayer1.children(this.scrollBarYLayer);
    this.horizontalLayer2.children(this.sheetSwitchTabLayer);
    this.horizontalLayer2.children(this.scrollBarXHorizontalLayer);

    // 根布局
    // eslint-disable-next-line max-len
    this.horizontalLayer1Layer = new VerticalLayerElement({ style: { flexGrow: 1 } });
    this.horizontalLayer2Layer = new VerticalLayerElement();
    this.layerVerticalLayer = new VerticalLayer();
    this.horizontalLayer1Layer.children(this.horizontalLayer1);
    this.horizontalLayer2Layer.children(this.horizontalLayer2);
    this.layerVerticalLayer.children(this.horizontalLayer1Layer);
    this.layerVerticalLayer.children(this.horizontalLayer2Layer);
    this.children(this.layerVerticalLayer);

    // 组件
    this.sheetView = new SheetView();
    this.scrollBarY = new ScrollBarY({
      scroll: (move) => {
        const sheet = this.sheetView.getActiveSheet();
        sheet.table.scrollY(move);
      },
    });
    this.tabView = new TabView({
      onAdd: () => {
        const sheet = new Sheet();
        const tab = new Tab();
        this.addTabSheet({ tab, sheet });
      },
      onSwitch: (tab) => {
        this.setActiveTab(tab);
      },
    });
    this.scrollBarX = new ScrollBarX({
      scroll: (move) => {
        const sheet = this.sheetView.getActiveSheet();
        sheet.table.scrollX(move);
      },
    });
  }

  updateScroll() {
    const sheet = this.sheetView.getActiveSheet();
    if (Utils.isUnDef(sheet)) return;
    const { scrollBarXHorizontalLayer } = this;
    const { table } = sheet;
    const { content } = table;
    const { contentOffset, scroll } = table;
    scrollBarXHorizontalLayer.display(contentOffset.getFixedWidth() < content.getContentWidth());
    this.scrollBarY.setSize(contentOffset.getFixedHeight(), content.getContentHeight());
    this.scrollBarX.setSize(contentOffset.getFixedWidth(), content.getContentWidth());
    this.scrollBarY.scrollMove(scroll.y);
    this.scrollBarX.scrollMove(scroll.x);
  }

  createSheet() {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of this.sheets) {
      // eslint-disable-next-line no-restricted-syntax
      const { name } = item;
      const sheet = new Sheet(item);
      const tab = new Tab(name);
      this.addTabSheet({ tab, sheet });
    }
    if (this.tabSheet.length) {
      this.setActiveIndex(0);
    }
  }

  bind() {
    this.on(Constant.SYSTEM_EVENT_TYPE.MOUSE_WHEEL, (evt) => {
      const sheet = this.sheetView.getActiveSheet();
      if (Utils.isUnDef(sheet)) return;
      const { table } = sheet;
      const { rows, scroll } = table;
      const { scrollTo } = this.scrollBarY;
      let { deltaY } = evt;
      if (evt.detail) deltaY = evt.detail * 40;
      if (deltaY > 0) {
        // down
        this.scrollBarY.scrollMove(scrollTo + rows.getHeight(scroll.ri));
      } else {
        // up
        this.scrollBarY.scrollMove(scrollTo - rows.getHeight(scroll.ri - 1));
      }
      if (scroll.blockTop < scroll.maxBlockTop && scroll.blockTop > 0) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    });
    EventBind.bind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, () => {
      const { sheetView } = this;
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.resize();
      this.updateScroll();
    });
    EventBind.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.updateScroll();
    });
    EventBind.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.updateScroll();
    });
    EventBind.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.DATA_CHANGE, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
      e.stopPropagation();
    });
    EventBind.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE);
      e.stopPropagation();
    });
    EventBind.bind(this.sheetView, Constant.TABLE_EVENT_TYPE.SELECT_DOWN, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_DOWN, this);
      e.stopPropagation();
    });
  }

  onAttach() {
    const {
      sheetViewLayer, scrollBarYLayer, sheetSwitchTabLayer, scrollBarXLayer,
    } = this;
    sheetViewLayer.attach(this.sheetView);
    scrollBarYLayer.attach(this.scrollBarY);
    sheetSwitchTabLayer.attach(this.tabView);
    scrollBarXLayer.attach(this.scrollBarX);
    this.bind();
    this.createSheet();
    this.updateScroll();
  }

  addTabSheet({ tab, sheet }) {
    const {
      tabSheet, sheetView, tabView,
    } = this;
    sheetView.attach(sheet);
    tabView.attach(tab);
    tabSheet.push({
      tab, sheet,
    });
  }

  setActiveIndex(index) {
    const { sheetView, tabView } = this;
    const sheet = sheetView.setActiveSheet(index);
    const tab = tabView.setActiveTab(index);
    if (sheet && tab) {
      const { table } = sheet;
      this.updateScroll();
      table.resize();
      this.trigger(Constant.WORK_BODY_EVENT_TYPE.CHANGE_ACTIVE);
    }
  }

  setActiveTab(tab) {
    this.tabSheet.forEach((item, index) => {
      if (item.tab === tab) {
        this.setActiveIndex(index);
      }
    });
  }
}

export { WorkBody };
