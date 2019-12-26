/* global window */

import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { VerticalLayer } from '../lib/layer/VerticalLayer';
import { HorizontalLayer } from '../lib/layer/HorizontalLayer';
import { VerticalLayerElement } from '../lib/layer/VerticalLayerElement';
import { ScrollBarX } from '../component/ScrollBarX';
import { ScrollBarY } from '../component/ScrollBarY';
import { HorizontalLayerElement } from '../lib/layer/HorizontalLayerElement';
import { VerticalCenterElement } from '../lib/layer/center/VerticalCenterElement';
import { VerticalCenter } from '../lib/layer/center/VerticalCenter';
import { Constant } from '../utils/Constant';
import { SheetView } from './SheetView';
import { SheetSwitchTab } from './SheetSwitchTab';
import { Utils } from '../utils/Utils';
import { Sheet } from './Sheet';

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
  constructor(options) {
    super(`${cssPrefix}-work-body`);

    this.workConfig = options.workConfig;
    this.sheetData = options.sheetData;
    this.tabAndSheet = [];

    // 组件
    this.sheetView = new SheetView();
    this.sheetSwitchTab = new SheetSwitchTab({
      onAdd(tab) {
        return tab;
      },
      onSwitch(tab) {
        return tab;
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
    sheetSwitchTabLayerHorizontalElement = new HorizontalLayerElement(this.sheetSwitchTab, {
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
  }

  init() {
    this.sheetView.init();
    this.sheetSwitchTab.init();
    this.scrollBarX.init();
    this.scrollBarY.init();
    this.bind();
    this.setSheet();
    this.setScroll();
  }

  setScroll() {
    const sheet = this.sheetView.getActiveSheet();
    if (Utils.isUnDef(sheet)) return;
    const { table } = sheet;
    const { content } = table;
    this.scrollBarY.setSize(content.getHeight(), content.getContentHeight());
    this.scrollBarX.setSize(content.getWidth(), content.getContentWidth());
    scrollBarXLayerHorizontalElement.display(!this.scrollBarX.isHide);
  }

  setSheet() {
    const { sheetView, sheetSwitchTab } = this;
    // eslint-disable-next-line no-restricted-syntax
    for (const item of this.sheetData) {
      // eslint-disable-next-line no-restricted-syntax
      const { name, data } = item;
      const { sheetConfig } = this.workConfig;
      const newSheetConfig = Utils.cloneDeep(sheetConfig);
      newSheetConfig.data = data;
      const sheet = new Sheet(newSheetConfig);
      const tab = sheetSwitchTab.add(name);
      sheetView.add(sheet);
      this.tabAndSheet.push({ tab, sheet });
    }
    this.setActive(this.tabAndSheet.length - 1);
  }

  setActive(index) {
    const { sheetView, sheetSwitchTab } = this;
    sheetView.setActiveSheet(index);
    sheetSwitchTab.setActiveTab(index);
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
    window.addEventListener(Constant.EVENT_TYPE.RESIZE, () => {
      this.setScroll();
    });
  }
}

export { WorkBody };
