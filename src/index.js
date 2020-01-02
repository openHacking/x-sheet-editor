/* global window, document */

import { cssPrefix } from './config';
import { h } from './lib/Element';
import { Work } from './core/work/Work';
import { Widget } from './lib/Widget';
import './base.less';
import './index.less';
import { Data } from './DataTest';
import { RectRange } from './core/table/RectRange';

class XSheet extends Widget {
  constructor(selectors, options = {
    workConfig: {
      body: {
        sheets: [
          {
            name: '白云测试',
            tableConfig: {
              merges: [
                new RectRange(0, 0, 0, 1),
                new RectRange(1, 1, 2, 2),
                new RectRange(3, 3, 4, 4),
              ],
              fixed: {
                fxTop: 1,
                fxLeft: 0,
              },
              data: Data,
            },
          },
          {
            name: 'jerry测试',
            tableConfig: {
              merges: [
                new RectRange(0, 0, 0, 1),
                new RectRange(1, 1, 2, 2),
                new RectRange(3, 3, 4, 4),
              ],
              data: Data,
            },
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
