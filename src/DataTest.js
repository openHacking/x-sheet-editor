const Data = [];
for (let i = 1; i <= 8000; i++) {
  const rows = [];
  for (let j = 1; j <= 80; j++) {
    rows.push({
      text: `行: ${i} 列:${j}`,
    });
  }
  Data.push(rows);
}
export { Data };
