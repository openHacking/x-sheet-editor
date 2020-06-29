/* global window, document */

import { cssPrefix } from './constant/Constant';
import { h } from './lib/Element';
import { Work } from './core/work/Work';
import { Widget } from './lib/Widget';
import './less/base.less';
import './less/index.less';
import './purchaseorder';

class XSheet extends Widget {

  constructor(selectors, options = {
    workConfig: {
      body: {
        sheets: [{
          tableConfig: {},
        }],
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
    this.attach(this.work);
  }
}

XSheet.version = '1.0.1-alpha';

if (window) {
  window.XSheet = XSheet;
}

export { XSheet };
