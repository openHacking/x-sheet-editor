/* global document */

import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { Utils } from '../../utils/Utils';
import { h } from '../../lib/Element';
import { Animate } from '../../lib/animate/Animate';

class PopUp extends Widget {
  constructor(className = '', options) {
    super(`${cssPrefix}-pop-up-layer ${className}`);
    this.options = Utils.mergeDeep({}, options);
  }

  open() {
    h(document.body).children(this);
    this.css('opacity', 0);
    const animate = new Animate({
      begin: 0,
      end: 1,
      receive: (val) => {
        this.css('opacity', val);
      },
    });
    animate.request();
  }

  close() {
    const animate = new Animate({
      begin: 1,
      end: 0,
      receive: (val) => {
        this.css('opacity', val);
      },
      complete: () => {
        h(document.body).remove(this);
      },
    });
    animate.request();
  }
}

export { PopUp };
