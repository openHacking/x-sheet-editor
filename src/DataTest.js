const Data = new Array(10000);

for (let i = 0; i < Data.length; i += 1) {
  const rows = new Array(80);
  for (let j = 0; j < rows.length; j += 1) {
    rows[j] = {
      text: `行: ${i + 1} 列:${j + 1}`,
    };
    if (i === 0 && j === 0) {
      rows[j].style = {};
      rows[j].style.textWrap = true;
    }
  }
  Data[i] = rows;
}

export { Data };
