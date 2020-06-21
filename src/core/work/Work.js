import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../constant/Constant';
import { VerticalLayer } from '../../lib/layer/VerticalLayer';
import { VerticalLayerElement } from '../../lib/layer/VerticalLayerElement';
import { WorkTop } from './WorkTop';
import { WorkBody } from './WorkBody';
import { WorkBottom } from './WorkBottom';

class Work extends Widget {

  constructor(options = {
    body: {},
  }) {
    super(`${cssPrefix}-work`);
    this.options = options.workConfig;

    // 布局
    this.topLayer = new VerticalLayerElement();
    this.bodyLayer = new VerticalLayerElement({ style: { flexGrow: 1 } });
    this.bottomLayer = new VerticalLayerElement();
    this.verticalLayer = new VerticalLayer();
    this.verticalLayer.children(this.topLayer);
    this.verticalLayer.children(this.bodyLayer);
    this.verticalLayer.children(this.bottomLayer);
    this.children(this.verticalLayer);
  }

  onAttach() {
    const {
      bodyLayer, topLayer, bottomLayer,
    } = this;
    this.body = new WorkBody(this, this.options.body);
    this.top = new WorkTop(this);
    this.bottom = new WorkBottom(this);
    bodyLayer.attach(this.body);
    topLayer.attach(this.top);
    bottomLayer.attach(this.bottom);
    this.bottom.bottomMenu.setSum(0);
    this.bottom.bottomMenu.setAvg(0);
    this.bottom.bottomMenu.setNumber(0);
  }
}

export { Work };
