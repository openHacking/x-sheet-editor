const Data = [];

for (let i = 1; i <= 1000; i += 1) {
  const rows = [];
  for (let j = 1; j <= 80; j++) {
    rows.push({
      text: `行: ${i} 列:${j}`,
    });
  }
  Data.push(rows);
}

export { Data };
