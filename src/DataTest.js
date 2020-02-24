import { Cells } from './core/table/Cells';
import { Utils } from './utils/Utils';

const Data = [];

for (let i = 0; i < 1000; i += 1) {
  const rows = [];
  for (let j = 0; j < 80; j += 1) {
    const item = Utils.mergeDeep(Cells.getDefaultAttr(), {
      text: `行: ${i + 1} 列:${j + 1}`,
    });
    rows.push(item);
  }
  Data.push(rows);
}

export { Data };
