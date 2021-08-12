addEventListener("message" , (event) => {
  let { range, data, group } = event.data;
  let { sri, eri, sci, eci } = range;
  let items = [];
  let result = [];
  for (let i = sri; i <= eri; i++) {
    if (i > 0) {
      if (i % group === 0) {
        result.push(items);
        items = [];
      }
    }
    let row = data[i];
    let block = row.splice(sci, eci - sci + 1);
    items.push(block);
  }
  if (items.length) {
    result.push(items);
  }
  postMessage(result);
});

