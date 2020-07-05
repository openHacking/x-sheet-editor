/* global window */

const array = [];

// eslint-disable-next-line no-plusplus
for (let i = 0; i < 1000; i++) {
  array.push([
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
    { text: `${i}-11111111111111111` },
  ]);
}

const testData = {
  name: '测试',
  tableConfig: {
    table: {},
    rows: { data: [null, { height: 55 }, null, null, null, null, null, { height: 30 }], len: 36 },
    cols: { data: [{ width: 30 }, { width: 94 }, { width: 20 }, { width: 133 }, { width: 130 }, { width: 139 }, { width: 148 }, null, { width: 38 }, { width: 36 }, { width: 34 }, { width: 36 }, { width: 37 }, { width: 37 }, { width: 41 }, { width: 39 }, { width: 39 }, { width: 34 }, { width: 37 }, { width: 33 }, { width: 37 }, { width: 37 }, { width: 37 }, { width: 37 }, { width: 37 }, { width: 36 }, { width: 39 }, { width: 37 }, { width: 36 }, { width: 39 }, { width: 42 }, { width: 42 }, { width: 44 }, { width: 43 }, { width: 39 }, { width: 39 }, { width: 43 }, { width: 40 }, { width: 41 }, { width: 40 }, { width: 38 }, { width: 42 }, { width: 44 }, { width: 41 }, { width: 40 }, { width: 41 }, { width: 43 }, { width: 41 }, { width: 42 }, { width: 44 }, { width: 41 }, { width: 41 }, { width: 43 }, { width: 45 }, { width: 44 }, { width: 44 }, { width: 44 }, { width: 45 }, { width: 45 }, { width: 44 }, { width: 43 }, { width: 42 }, { width: 43 }, { width: 42 }, { width: 44 }, { width: 45 }, { width: 40 }, { width: 42 }], width: 100, len: 70 },
    data: array,
  },
};

window.testData = testData;

export { testData };
