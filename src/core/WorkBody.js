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
let horizontalLayer1LayerVerticalElement;
let horizontalLayer2Layer1LayerVerticalElement;
let layerVerticalLayer;

class WorkBody extends Widget {
  constructor() {
    super(`${cssPrefix}-work-body`);

    // 组件
    this.sheetView = new SheetView();
    this.sheetSwitchTab = new SheetSwitchTab();
    this.scrollBarX = new ScrollBarX({
      scroll: (move) => {
        this.sheetView.getActiveSheet().table.scrollXTo(move);
      },
    });
    this.scrollBarY = new ScrollBarY({
      scroll: (move) => {
        this.sheetView.getActiveSheet().table.scrollYTo(move);
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
    this.setScroll();
  }

  setScroll() {
    const { table } = this.sheetView.getActiveSheet();
    this.scrollBarY.setSize(table.gridVisualHeight(), table.gridContentHeight());
    this.scrollBarX.setSize(table.gridVisualWidth(), table.gridContentWidth());
    scrollBarXLayerHorizontalElement.display(!this.scrollBarX.isHide);
  }

  bind() {
    this.on(Constant.EVENT_TYPE.MOUSE_WHEEL, (evt) => {
      const { scrollTo } = this.scrollBarY;
      const { scroll, rows } = this.sheetView.getActiveSheet().table;
      if (evt.detail > 0) {
        // down
        this.scrollBarY.scrollMove(scrollTo + rows.getHeight(scroll.ri + 1));
      } else {
        // up
        this.scrollBarY.scrollMove(scrollTo - rows.getHeight(scroll.ri - 1));
      }
    });
    window.addEventListener(Constant.EVENT_TYPE.RESIZE, () => {
      this.setScroll();
    });
  }
}

export { WorkBody };
