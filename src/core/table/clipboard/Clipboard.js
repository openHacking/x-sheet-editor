import { cssPrefix } from '../../../config';
import { Widget } from '../../../lib/Widget';

const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <rect class="${cssPrefix}-selector-clipboard-stroked" x="0" y="0" width="100%" height="100%" />
  </svg>
`;

class Clipboard extends Widget {

}

export { Clipboard };
