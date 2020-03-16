/* global window, document */

import { cssPrefix } from './config';
import { h } from './lib/Element';
import { Work } from './core/work/Work';
import { Widget } from './lib/Widget';
import './base.less';
import './index.less';
import './template/calendar';
import './template/purchaseorder';
import './template/testdata';

class XSheet extends Widget {
  constructor(selectors, options = {
    workConfig: {
      body: {
        sheets: [
          {
            name: 'default',
          },
        ],
      },
    },
  }) {
    super(`${cssPrefix}`);
    let root = selectors;
    if (typeof selectors === 'string') {
      root = document.querySelector(selectors);
    }
    root = h(root);
    root.children(this);
    this.work = new Work(options);
    this.children(this.work);
    this.work.init();
  }
}

if (window) {
  window.XSheet = XSheet;
}

export { XSheet };
