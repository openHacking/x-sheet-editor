import { Cell } from './core/table/cells/Cell';

const Data = [];

for (let i = 0; i < 1000; i += 1) {
  const rows = [];
  for (let j = 0; j < 80; j += 1) {
    const item = new Cell({
      text: `行: ${i + 1} 列:${j + 1}`,
    });
    rows.push(item);
  }
  Data.push(rows);
}

export { Data };
