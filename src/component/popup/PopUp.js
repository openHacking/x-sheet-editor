/* global document window */

import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { Utils } from '../../utils/Utils';
import { h } from '../../lib/Element';
import { Animate } from '../../lib/animate/Animate';
import { OffsetLocation } from './OffsetLocation';
import { ElLocation, LOCATION_TYPE } from './ElLocation';
import { HorizontalLayerElement } from '../../lib/layer/HorizontalLayerElement';
import { HorizontalLayer } from '../../lib/layer/HorizontalLayer';
import { ScrollBarY } from '../scrollbar/ScrollBarY';

let contentLayerHorizontalElement;
let scrollBarYLayerHorizontalElement;
let horizontalLayer;

class PopUp extends Widget {
  constructor(className = '', options) {
    super(`${cssPrefix}-pop-up-layer ${className}`);
    this.options = Utils.copyProp({
      location: new OffsetLocation(0, 0),
    }, options);
    this.off = false;
    this.content = h('div', `${cssPrefix}-pop-up-layer-content`);
    this.scrollBarY = new ScrollBarY({
      scroll: () => {},
    });
    // 布局
    contentLayerHorizontalElement = new HorizontalLayerElement(this.content, {
      style: {
        flexGrow: 1,
      },
    });
    scrollBarYLayerHorizontalElement = new HorizontalLayerElement(this.scrollBarY, {
      style: {
        overflow: 'inherit',
      },
    });
    horizontalLayer = new HorizontalLayer({
      layerElements: [contentLayerHorizontalElement, scrollBarYLayerHorizontalElement],
    });
    this.children(horizontalLayer);
  }

  computeDisplayLocation() {
    const { location } = this.options;
    if (location instanceof OffsetLocation) {
      this.css('top', `${location.y}px`);
      this.css('left', `${location.x}px`);
    }
    if (location instanceof ElLocation) {
      const {
        type, el, offset,
      } = location;
      const elBox = el.box();
      const popUpBox = this.box();
      switch (type) {
        case LOCATION_TYPE.TOP: {
          let { left, top } = elBox;
          left -= popUpBox.left;
          top -= popUpBox.top;
          left += offset.x;
          top += offset.y;
          const maxHeight = window.innerHeight - top;
          const height = popUpBox.height > maxHeight ? maxHeight : popUpBox.height;
          this.offset({
            top,
            left,
            height,
          });
          break;
        }
        case LOCATION_TYPE.BOTTOM: {
          let { left } = elBox;
          let top = elBox.top + elBox.height;
          left += offset.x;
          top += offset.y;
          const maxHeight = window.innerHeight - top;
          const height = popUpBox.height > maxHeight ? maxHeight : popUpBox.height;
          this.offset({
            top,
            left,
            height,
          });
          break;
        }
        case LOCATION_TYPE.LEFT: {
          let { left, top } = elBox;
          left -= popUpBox.left;
          left += offset.x;
          top += offset.y;
          const maxHeight = window.innerHeight - top;
          const height = popUpBox.height > maxHeight ? maxHeight : popUpBox.height;
          this.offset({
            top,
            left,
            height,
          });
          break;
        }
        case LOCATION_TYPE.RIGHT: {
          let { left, top } = elBox;
          left += elBox.width;
          left += offset.x;
          top += offset.y;
          const maxHeight = window.innerHeight - top;
          const height = popUpBox.height > maxHeight ? maxHeight : popUpBox.height;
          this.offset({
            top,
            left,
            height,
          });
          break;
        }
        default: break;
      }
    }
  }

  computeScrollBarYSize() {
    const contentBox = this.content.box();
    const popUpBox = this.box();
    this.scrollBarY.setSize(popUpBox.height, contentBox.height);
  }

  open() {
    if (this.off === false) {
      h(document.body).children(this);
      this.css('opacity', 0);
      this.computeDisplayLocation();
      this.computeScrollBarYSize();
      const popUpBox = this.box();
      const animate1 = new Animate({
        begin: 0,
        end: 1,
        receive: (val) => {
          this.css('opacity', val);
        },
      });
      const animate2 = new Animate({
        begin: popUpBox.top + 10,
        end: popUpBox.top,
        receive: (val) => {
          this.css('top', `${val}px`);
        },
      });
      animate1.request();
      animate2.request();
      this.off = true;
    }
  }

  close() {
    if (this.off) {
      const popUpBox = this.box();
      const animate1 = new Animate({
        begin: 1,
        end: 0,
        receive: (val) => {
          this.css('opacity', val);
        },
      });
      const animate2 = new Animate({
        begin: popUpBox.top,
        end: popUpBox.top + 10,
        receive: (val) => {
          this.css('top', `${val}px`);
        },
      });
      Animate.success(animate1, animate2).then(() => {
        h(document.body).remove(this);
        this.off = false;
      });
      animate1.request();
      animate2.request();
    }
  }
}

export { PopUp };
