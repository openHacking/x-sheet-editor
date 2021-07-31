import { Evaluate, Functions } from '../../src/formula/Compiler.js';

// 注册函数
Functions.register("SUM", (...args) => {
  return args.reduce((a, b) => a + b);
});
Functions.register("TEST", (...args) => {
  return 1
});

// 运行公式
const evaluateExprs = {
  case1: 'SUM(1,2,3) + 3',
  case2: '2 * (1 + 2)',
  case3: '{1, 2 + 3}',
  case4: '{1, {2 > 1, 4 * (1+2), 6, SUM(1, 1) / 2}, 2 + 3}',
  case5: '{}',
  case6: 'TEST() + 1'
};

// 公式运行
Object.keys(evaluateExprs).forEach((key) => {
  const expr = evaluateExprs[key];
  console.log(`==========${expr}==========`)
  console.log(Evaluate(expr));
});
