/* global window, document */

import { h } from './lib/Element';
import { Work } from './core/Work';
import { Widget } from './lib/Widget';
import { cssPrefix } from './config';
import './base.less';
import './index.less';

class XSheet extends Widget {
  constructor(selectors, options = {}) {
    super(`${cssPrefix}`);
    let root = selectors;
    if (typeof selectors === 'string') {
      root = document.querySelector(selectors);
    }
    root = h(root);
    this.work = new Work();
    this.children(this.work);
    root.children(this);
    this.work.init();
  }
}

if (window) {
  window.XSheet = XSheet;
}

export { XSheet };
