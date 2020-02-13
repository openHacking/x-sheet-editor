const Data = [];

for (let i = 0; i < 1000; i += 1) {
  const rows = [];
  for (let j = 0; j < 80; j += 1) {
    rows.push({
      text: `行: ${i + 1} 列:${j + 1}`,
    });
  }
  Data.push(rows);
}

export { Data };
