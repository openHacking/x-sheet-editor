/* global window, document */

import { cssPrefix, XSheetVersion } from './const/Constant';
import { h } from './lib/Element';
import { Work } from './core/work/Work';
import { Widget } from './lib/Widget';
import './styles/base.less';
import './styles/index.less';

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

XSheet.version = XSheetVersion;

if (window) {
  window.XSheet = XSheet;
}

export { XSheet };
