const Data = [];

for (let i = 0; i < 1000; i += 1) {
  const rows = [];
  for (let j = 0; j < 80; j += 1) {
    const item = {
      text: `行: ${i + 1} 列:${j + 1}`,
      fontAttr: {},
    };
    if (i === 3 && j === 3) {
      item.fontAttr.color = '#000';
      item.background = 'red';
    }
    rows.push(item);
  }
  Data.push(rows);
}

export { Data };
