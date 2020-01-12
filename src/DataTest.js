// const Data = [];
// for (let i = 1; i <= 100000; i += 1) {
//   const rows = [];
//   for (let j = 1; j <= 80; j++) {
//     rows.push({
//       text: `行: ${i} 列:${j}`,
//     });
//   }
//   Data.push(rows);
// }
const Data = new Array(1000).fill('').map( (row, ri) => {
  return new Array(50).fill('').map((col, ci) => {
    return {
      text: `行: ${ri} 列:${ci}`
    }
  })
});

export { Data };
