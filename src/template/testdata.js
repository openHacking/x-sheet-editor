/* global window */

const testData = {
  name: '测试',
  tableConfig: {
    table: {},
    rows: {
      data: [],
    },
    cols: {
      data: [],
    },
    merges: {
      data: [],
    },
    data: [
      [{
        ID: '1584265551097',
        text: '项目管理',
        format: 'default',
        background: null,
        fontAttr: {
          align: 'left',
          verticalAlign: 'middle',
          textWrap: 2,
          strikethrough: true,
          underline: true,
          color: 'rgb(0,0,0)',
          name: 'Arial',
          size: 14,
          bold: false,
          italic: false,
          direction: 'vertical',
        },
        borderAttr: {
          time: '1584265551097',
          left: {
            display: false,
            width: 1,
            color: '#000000',
          },
          top: {
            display: false,
            width: 1,
            color: '#000000',
          },
          right: {
            display: false,
            width: 1,
            color: '#000000',
          },
          bottom: {
            display: false,
            width: 1,
            color: '#000000',
          },
        },
      }],
    ],
  },
};

window.testData = testData;

export { testData };
