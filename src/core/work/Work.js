import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { VerticalLayer } from '../../lib/layer/VerticalLayer';
import { VerticalLayerElement } from '../../lib/layer/VerticalLayerElement';
import { WorkTop } from './WorkTop';
import { WorkBody } from './WorkBody';
import { WorkBottom } from './WorkBottom';

let topLayerVerticalElement;
let bodyLayerVerticalElement;
let bottomLayerVerticalElement;
let verticalLayer;

class Work extends Widget {
  constructor(options = { body: {} }) {
    super(`${cssPrefix}-work`);
    this.options = options.workConfig;
    // 组件
    this.body = new WorkBody(this, this.options.body);
    this.bottom = new WorkBottom(this);
    this.top = new WorkTop(this);
    // 布局
    topLayerVerticalElement = new VerticalLayerElement(this.top);
    bodyLayerVerticalElement = new VerticalLayerElement(this.body, {
      style: {
        flexGrow: 1,
      },
    });
    bottomLayerVerticalElement = new VerticalLayerElement(this.bottom);
    verticalLayer = new VerticalLayer({
      layerElements: [topLayerVerticalElement,
        bodyLayerVerticalElement, bottomLayerVerticalElement],
    });
    this.children(verticalLayer);
    this.bottom.bottomMenu.setSum(0);
    this.bottom.bottomMenu.setAvg(0);
    this.bottom.bottomMenu.setNumber(0);
  }

  init() {
    this.body.init();
    this.top.init();
    this.bottom.init();
  }
}

export { Work };
