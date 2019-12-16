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
let rootHorizontalLayer1LayerVerticalElement;
let rootHorizontalLayer2Layer1LayerVerticalElement;
let rootLayerVerticalLayer;

class WorkBody extends Widget {
  constructor() {
    super(`${cssPrefix}-work-body`);

    // 组件
    this.sheetView = new SheetView();
    this.sheetSwitchTab = new SheetSwitchTab();
    this.scrollBarX = new ScrollBarX();
    this.scrollBarY = new ScrollBarY();

    // sheet表和垂直滚动条
    sheetViewLayerHorizontalElement = new HorizontalLayerElement(this.sheetView, {
      style: {
        flexGrow: 1,
      },
    });
    scrollBarYLayerHorizontalElement = new HorizontalLayerElement(this.scrollBarY);
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
        overflow: 'hidden',
        flexGrow: 3,
      },
    });
    horizontalLayer2 = new HorizontalLayer({
      layerElements: [sheetSwitchTabLayerHorizontalElement, scrollBarXLayerHorizontalElement],
    });

    // 根布局
    rootHorizontalLayer1LayerVerticalElement = new VerticalLayerElement(horizontalLayer1, {
      style: {
        flexGrow: 1,
      },
    });
    rootHorizontalLayer2Layer1LayerVerticalElement = new VerticalLayerElement(horizontalLayer2);
    rootLayerVerticalLayer = new VerticalLayer({
      layerElements: [rootHorizontalLayer1LayerVerticalElement,
        rootHorizontalLayer2Layer1LayerVerticalElement],
    });

    // 添加布局
    this.children(rootLayerVerticalLayer);
  }

  init() {
    this.sheetView.init();
    this.sheetSwitchTab.init();
    this.scrollBarX.init();
    this.scrollBarY.init();
    this.bind();
    this.setScroll();
  }

  setScroll() {
    this.scrollBarY.setSize(this.sheetView.offset().height, 5000);
    this.scrollBarX.setSize(this.sheetView.offset().width, 5000);
    scrollBarXLayerHorizontalElement.display(!this.scrollBarX.isHide);
  }

  bind() {
    window.addEventListener(Constant.EVENT_TYPE.RESIZE, () => {
      this.setScroll();
    });
  }
}

export { WorkBody };
