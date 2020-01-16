const Data = new Array(1000);

for (let i = 0; i < Data.length; i += 1) {
  const rows = new Array(80);
  for (let j = 0; j < rows.length; j += 1) {
    rows[j] = {
      text: `行: ${i + 1} 列:${j + 1}`,
    };
  }
  Data[i] = rows;
}

export { Data };
