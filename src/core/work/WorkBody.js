/* global window */

import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { VerticalLayer } from '../../lib/layer/VerticalLayer';
import { HorizontalLayer } from '../../lib/layer/HorizontalLayer';
import { VerticalLayerElement } from '../../lib/layer/VerticalLayerElement';
import { ScrollBarX } from '../../component/ScrollBarX';
import { ScrollBarY } from '../../component/ScrollBarY';
import { HorizontalLayerElement } from '../../lib/layer/HorizontalLayerElement';
import { VerticalCenterElement } from '../../lib/layer/center/VerticalCenterElement';
import { VerticalCenter } from '../../lib/layer/center/VerticalCenter';
import { Constant } from '../../utils/Constant';
import { SheetView } from './SheetView';
import { TabView } from './TabView';
import { Utils } from '../../utils/Utils';
import { Sheet } from './Sheet';
import { Tab } from './Tab';
import { EventBind } from '../../utils/EventBind';

// sheet表和垂直滚动条
let sheetViewLayerHorizontalElement;
let scrollBarYLayerHorizontalElement;
let horizontalLayer1;

// sheetTab选修卡和水平滚动条
let scrollBarXLayerVerticalCenterElement;
let scrollBarXVerticalCenter;
let scrollBarXLayerHorizontalElement;
let sheetSwitchTabLayerHorizontalElement;
let horizontalLayer2;

// 根布局
let horizontalLayer1LayerVerticalElement;
let horizontalLayer2Layer1LayerVerticalElement;
let layerVerticalLayer;

class WorkBody extends Widget {
  constructor(options = { sheets: [] }) {
    super(`${cssPrefix}-work-body`);

    this.workConfig = options;
    this.sheets = this.workConfig.sheets;
    this.tabAndSheet = [];

    // 组件
    this.sheetView = new SheetView();
    this.tabView = new TabView({
      onAdd: (tab, tabIndex) => {
        const { sheetView } = this;
        const sheet = new Sheet();
        const sheetIndex = sheetView.add(sheet);
        this.tabAndSheet.push({
          tab,
          sheet,
          tabIndex,
          sheetIndex,
        });
      },
      onSwitch: (tab) => {
        this.setActiveTab(tab);
      },
    });
    this.scrollBarX = new ScrollBarX({
      scroll: (move) => {
        this.sheetView.getActiveSheet().table.scrollX(move);
      },
    });
    this.scrollBarY = new ScrollBarY({
      scroll: (move) => {
        this.sheetView.getActiveSheet().table.scrollY(move);
      },
    });

    // sheet表和垂直滚动条
    sheetViewLayerHorizontalElement = new HorizontalLayerElement(this.sheetView, {
      style: {
        flexGrow: 1,
      },
    });
    scrollBarYLayerHorizontalElement = new HorizontalLayerElement(this.scrollBarY, {
      style: {
        overflow: 'inherit',
      },
    });
    horizontalLayer1 = new HorizontalLayer({
      layerElements: [sheetViewLayerHorizontalElement, scrollBarYLayerHorizontalElement],
    });

    // sheetTab选修卡和水平滚动条
    scrollBarXLayerVerticalCenterElement = new VerticalCenterElement(this.scrollBarX);
    scrollBarXVerticalCenter = new VerticalCenter({
      centerElements: [scrollBarXLayerVerticalCenterElement],
    });
    scrollBarXLayerHorizontalElement = new HorizontalLayerElement(scrollBarXVerticalCenter, {
      style: {
        flexGrow: 2,
      },
    });
    sheetSwitchTabLayerHorizontalElement = new HorizontalLayerElement(this.tabView, {
      style: {
        flexGrow: 3,
      },
    });
    horizontalLayer2 = new HorizontalLayer({
      layerElements: [sheetSwitchTabLayerHorizontalElement, scrollBarXLayerHorizontalElement],
    });

    // 根布局
    horizontalLayer1LayerVerticalElement = new VerticalLayerElement(horizontalLayer1, {
      style: {
        flexGrow: 1,
      },
    });
    horizontalLayer2Layer1LayerVerticalElement = new VerticalLayerElement(horizontalLayer2);
    layerVerticalLayer = new VerticalLayer({
      layerElements: [horizontalLayer1LayerVerticalElement,
        horizontalLayer2Layer1LayerVerticalElement],
    });

    // 添加布局
    this.children(layerVerticalLayer);
    this.bind();
  }

  init() {
    this.sheetView.init();
    this.tabView.init();
    this.scrollBarX.init();
    this.scrollBarY.init();
    this.initSheet();
    this.initScroll();
  }

  initScroll() {
    const sheet = this.sheetView.getActiveSheet();
    if (Utils.isUnDef(sheet)) return;
    const { table } = sheet;
    const { content } = table;
    this.scrollBarY.setSize(content.getHeight(), content.getContentHeight());
    this.scrollBarX.setSize(content.getWidth(), content.getContentWidth());
    scrollBarXLayerHorizontalElement.display(!this.scrollBarX.isHide);
  }

  initSheet() {
    const { sheetView, tabView } = this;
    // eslint-disable-next-line no-restricted-syntax
    for (const item of this.sheets) {
      // console.log(item);
      // eslint-disable-next-line no-restricted-syntax
      const { name } = item;
      const sheet = new Sheet(item);
      const tab = new Tab(name);
      const sheetIndex = sheetView.add(sheet);
      const tabIndex = tabView.add(tab);
      this.tabAndSheet.push({
        tab,
        sheet,
        tabIndex,
        sheetIndex,
      });
    }
    const first = this.tabAndSheet[0];
    if (first) {
      this.setActiveTabIndex(first.tabIndex);
      this.setActiveSheetIndex(first.sheetIndex);
    }
  }

  setActiveSheetIndex(index) {
    const { sheetView } = this;
    const sheet = sheetView.setActiveSheet(index);
    if (sheet) {
      const { table } = sheet;
      const { content } = table;
      const { scroll } = content;
      const { scrollBarX, scrollBarY } = this;
      scrollBarX.scrollMove(scroll.x);
      scrollBarY.scrollMove(scroll.y);
    }
  }

  setActiveTabIndex(index) {
    const { tabView } = this;
    tabView.setActiveTab(index);
  }

  setActiveTab(tab) {
    this.tabAndSheet.forEach((item) => {
      if (item.tab === tab) {
        this.setActiveTabIndex(item.tabIndex);
        this.setActiveSheetIndex(item.sheetIndex);
      }
    });
  }

  bind() {
    this.on(Constant.EVENT_TYPE.MOUSE_WHEEL, (evt) => {
      const sheet = this.sheetView.getActiveSheet();
      if (Utils.isUnDef(sheet)) return;
      const { table } = sheet;
      const { rows, content } = table;
      const { scroll } = content;
      const { scrollTo } = this.scrollBarY;
      let { deltaY } = evt;
      if (evt.detail) deltaY = evt.detail * 40;
      if (deltaY > 0) {
        // down
        this.scrollBarY.scrollMove(scrollTo + rows.getHeight(scroll.ri + 1));
      } else {
        // up
        this.scrollBarY.scrollMove(scrollTo - rows.getHeight(scroll.ri - 1));
      }
      if (scroll.blockTop < scroll.maxBlockTop && scroll.blockTop > 0) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    });
    EventBind.bind(window, Constant.EVENT_TYPE.RESIZE, () => {
      this.initScroll();
    });
    EventBind.bind(this.sheetView, Constant.EVENT_TYPE.CHANGE_HEIGHT, () => {
      // console.log('change height');
      this.initScroll();
    });
    EventBind.bind(this.sheetView, Constant.EVENT_TYPE.CHANGE_WIDTH, () => {
      // console.log('change width');
      this.initScroll();
    });
  }
}

export { WorkBody };
