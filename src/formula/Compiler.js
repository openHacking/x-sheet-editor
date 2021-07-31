/**
 * 词法分析
 */
class Tokenizer {

  /**
   * 词法分析
   * @param input
   * @returns {*[]}
   */
  lexical(input) {
    let OPERATOR = /^(\+|-|\*|\/|%|>|<|,|\^|=|&|!|:|>=|<=|<>)$/;
    let NUMBERS = /[0-9.]/;
    let LETTERS = /[a-z0-9$]/i;
    // 文本字符长度
    let { length } = input;
    // 函数调用记录
    let callStack = [];
    // 当前的字符索引
    let current = 0;
    // 处理的字符数组
    let tokens = [];
    // 循环处理所有字符
    while (current < length) {
      // 当前处理的字符
      let char = input[current];
      // 跳过连续空格
      let SPACE = /\s/;
      if (SPACE.test(char)) {
        const next = input[current + 1];
        if (SPACE.test(next)) {
          current++;
          continue;
        }
      }
      // 记录交叉区域运算符
      if (SPACE.test(char)) {
        const last = input[current - 1];
        const next = input[current + 1];
        if (LETTERS.test(last) && LETTERS.test(next)) {
          tokens.push({
            type: 'operator',
            value: char,
          });
        }
        current++;
        continue;
      }
      // 记录括号
      if (char === '(') {
        if (callStack.length) {
          tokens.push({
            type: 'function',
            value: '(',
          });
        } else {
          tokens.push({
            type: 'brackets',
            value: '(',
          });
        }
        current++;
        continue;
      }
      if (char === ')') {
        if (callStack.length) {
          tokens.push({
            type: 'function',
            value: ')',
          });
        } else {
          tokens.push({
            type: 'brackets',
            value: ')',
          });
        }
        callStack.pop();
        current++;
        continue;
      }
      // 记录数组
      if (char === '{') {
        tokens.push({
          type: 'array',
          value: 'array',
        });
        tokens.push({
          type: 'array',
          value: '{',
        });
        current++;
        continue;
      }
      if (char === '}') {
        tokens.push({
          type: 'array',
          value: '}',
        });
        current++;
        continue;
      }
      // 记录字符串
      if (char === '"') {
        let result = '';
        current++;
        char = input[current];
        while (char !== '"') {
          if (current < length) {
            result += char;
            current++;
            char = input[current];
          } else {
            break;
          }
        }
        current++;
        char = input[current];
        tokens.push({
          type: 'string',
          value: result,
        });
        continue;
      }
      if (char === '\'') {
        let result = '';
        current++;
        char = input[current];
        while (char !== '\'') {
          if (current < length) {
            result += char;
            current++;
            char = input[current];
          } else {
            break;
          }
        }
        current++;
        char = input[current];
        tokens.push({
          type: 'string',
          value: result,
        });
        continue;
      }
      // 记录运算符
      if (OPERATOR.test(char)) {
        let next = input[current + 1];
        let result = `${char}${next}`;
        if (OPERATOR.test(result)) {
          tokens.push({
            type: 'operator',
            value: result,
          });
          current++;
        } else {
          tokens.push({
            type: 'operator',
            value: char,
          });
        }
        current++;
        continue;
      }
      // 记录数字值
      if (NUMBERS.test(char)) {
        let result = '';
        while (NUMBERS.test(char)) {
          if (current < length) {
            result += char;
            current++;
            char = input[current];
          } else {
            break;
          }
        }
        tokens.push({
          type: 'number',
          value: result,
        });
        continue;
      }
      // 记录函数名称, 参数名称, 操作数名称
      if (LETTERS.test(char)) {
        let result = '';
        while (LETTERS.test(char)) {
          if (current < length) {
            result += char;
            current++;
            char = input[current];
          } else {
            break;
          }
        }
        // 是否为函数名称
        if (char === '(') {
          callStack.push(char);
          tokens.push({
            type: 'function',
            value: result,
          });
        } else {
          tokens.push({
            type: 'operand',
            value: result,
          });
        }
        continue;
      }
      // 无法识别的token
      throw new TypeError(`无法识别的token ${char} `);
    }
    // 返回处理结果
    return tokens;
  }
}

/**
 * 指令集
 */
class Assembly {

  /**
   * Assembly
   */
  constructor() {
    this.assembly = '';
  }

  /**
   * 写入操作数
   * @param digit
   */
  writePush(digit) {
    this.assembly += `push ${digit}\r\n`;
  }

  /**
   * 写入运算符
   * @param op
   */
  writeOp(op) {
    this.assembly += `${op}\r\n`;
  }

  /**
   * 获取指令详情
   * @returns {string}
   */
  getInstruct() {
    let { assembly } = this;
    let flag = '\r\n';
    while (assembly.endsWith(flag)) {
      let { length } = assembly;
      assembly = assembly.substring(0, length - flag.length);
    }
    return assembly;
  }
}

/**
 * 编译表达式
 */
class Compiler {

  /**
   * Compiler
   * @param tokens
   * @param writer
   */
  constructor(tokens, writer) {
    this.writer = writer;
    this.tokens = tokens;
    this.groupStack = [];
    this.index = -1;
    this.ignore = [','];
    // 运算符
    this.opIf = {
      '>': 'ifge',
      '<': 'ifgt',
      '=': 'ifeq',
      '>=': 'if_icmpge',
      '<=': 'if_icmpgt',
      '<>': 'ifne',
    };
    this.opAdd = {
      '+': 'add',
      '-': 'sub',
      '&': 'link',
    };
    this.opMul = {
      '*': 'mul',
      '/': 'div',
      '%': 'mod',
      '^': 'power',
    };
    this.opCommon = {
      ' ': 'common',
    };
    this.opRel = {
      '!': 'rel',
      ':': 'uni',
    };
    this.opNew = {
      array: 'newarray',
    };
    this.opCell = {
      function: 'invoke',
    };
  }

  /**
   * 结束
   */
  eofToken() {
    const { index, tokens } = this;
    const { length } = tokens;
    return index >= length - 1;
  }

  /**
   * 切换下一个Token
   */
  nextToken() {
    this.index++;
    this.token = this.tokens[this.index];
    return this.token;
  }

  /**
   * 返回上一个Token
   */
  backToken() {
    this.index--;
    this.token = this.tokens[this.index];
    return this.token;
  }

  /**
   * 记录参数
   */
  reduceGroup() {
    const { groupStack } = this;
    const { length } = groupStack;
    if (length > 0) {
      const last = groupStack[length - 1];
      const number = last.number;
      last.number = number - 1;
    }
  }

  /**
   * 记录参数
   */
  increaseGroup() {
    const { groupStack } = this;
    const { length } = groupStack;
    if (length > 0) {
      const last = groupStack[length - 1];
      const number = last.number;
      last.number = number + 1;
    }
  }

  /**
   * 弹出组
   */
  popGroup() {
    return this.groupStack.pop();
  }

  /**
   * 添加组
   */
  addGroup(token) {
    token.number = 0;
    this.groupStack.push(token);
    return token;
  }

  /**
   * 忽略的Token
   * @returns {*}
   */
  isSkipNextToken() {
    if (!this.eofToken()) {
      const { ignore } = this;
      this.nextToken();
      const { token } = this;
      this.backToken();
      const { value } = token;
      return ignore.includes(value);
    }
    return false;
  }

  /**
   * 编译表达式
   */
  compile() {
    const { writer } = this;
    this.compileIfge();
    return writer.getInstruct();
  }

  /**
   * 编译条件运算
   */
  compileIfge() {
    this.compileAdd();
    while (!this.eofToken()) {
      const token = this.nextToken();
      const { type, value } = token;
      if (type !== 'operator') {
        this.backToken();
        break;
      }
      if (!this.opIf[value]) {
        this.backToken();
        break;
      }
      let operator = this.opIf[value];
      this.compileAdd();
      this.reduceGroup();
      this.writer.writeOp(operator);
    }
  }

  /**
   * 编译加减运算
   */
  compileAdd() {
    this.compileMul();
    while (!this.eofToken()) {
      const token = this.nextToken();
      const { type, value } = token;
      if (type !== 'operator') {
        this.backToken();
        break;
      }
      if (!this.opAdd[value]) {
        this.backToken();
        break;
      }
      let operator = this.opAdd[value];
      this.compileMul();
      this.reduceGroup();
      this.writer.writeOp(operator);
    }
  }

  /**
   * 编译乘除运算
   */
  compileMul() {
    this.compileCommon();
    while (!this.eofToken()) {
      const token = this.nextToken();
      const { type, value } = token;
      if (type !== 'operator') {
        this.backToken();
        break;
      }
      if (!this.opMul[value]) {
        this.backToken();
        break;
      }
      let operator = this.opMul[value];
      this.compileCommon();
      this.reduceGroup();
      this.writer.writeOp(operator);
    }
  }

  /**
   * 编译公共区域运算
   */
  compileCommon() {
    this.compileRel();
    while (!this.eofToken()) {
      const token = this.nextToken();
      const { type, value } = token;
      if (type !== 'operator') {
        this.backToken();
        break;
      }
      if (!this.opCommon[value]) {
        this.backToken();
        break;
      }
      let operator = this.opCommon[value];
      this.compileRel();
      this.reduceGroup();
      this.writer.writeOp(operator);
    }
  }

  /**
   * 编译跨Sheet引用运算
   */
  compileRel() {
    this.compileArray();
    while (!this.eofToken()) {
      const token = this.nextToken();
      const { type, value } = token;
      if (type !== 'operator') {
        this.backToken();
        break;
      }
      if (!this.opRel[value]) {
        this.backToken();
        break;
      }
      let operator = this.opRel[value];
      this.compileArray();
      this.reduceGroup();
      this.writer.writeOp(operator);
    }
  }

  /**
   * 编译数组创建
   */
  compileArray() {
    this.compileFunction();
    while (!this.eofToken()) {
      const token = this.nextToken();
      const { type, value } = token;
      if (type !== 'array') {
        this.backToken();
        break;
      }
      // 返回跳过 } 标记
      if (value === '}') {
        this.backToken();
        break;
      }
      this.addGroup(token);
      // 跳过当前 {  标记
      this.nextToken();
      // 处理数组中的子元素
      this.compileIfge();
      // 下一个是忽略的标记
      // 则继续处理
      while (this.isSkipNextToken()) {
        this.nextToken();
        this.compileIfge();
      }
      // 记录数组需要
      // 操作的元素数量
      this.popGroup();
      const { number } = token;
      const operator = this.opNew[type];
      this.writer.writeOp(`${operator} ${number}`);
      // 跳过闭合标签 }
      this.nextToken();
    }
  }

  /**
   * 编译函数调用
   */
  compileFunction() {
    this.compilePush();
    while (!this.eofToken()) {
      const token = this.nextToken();
      const { type, value } = token;
      if (type !== 'function') {
        this.backToken();
        break;
      }
      // 返回跳过 ) 标记
      if (value === ')') {
        this.backToken();
        break;
      }
      this.addGroup(token);
      // 跳过当前 (  标记
      this.nextToken();
      // 处理函数的参数列表
      this.compileIfge();
      // 下一个是忽略的标记
      // 则继续处理
      while (this.isSkipNextToken()) {
        this.nextToken();
        this.compileIfge();
      }
      // 记录函数需要
      // 操作的元素数量
      this.popGroup();
      const { number } = token;
      const operator = this.opCell[type];
      this.writer.writeOp(`${operator} ${value} ${number}`);
      // 跳过闭合标签 )
      this.nextToken();
    }
  }

  /**
   * compilePush
   */
  compilePush() {
    if (!this.eofToken()) {
      const token = this.nextToken();
      const { writer } = this;
      const { type, value } = token;
      // 推送操作数
      // 递增函数/数组的参数数量(有的话)
      switch (type) {
        case 'string': {
          this.increaseGroup();
          writer.writePush(`"${value}"`);
          return;
        }
        case 'number':
        case 'operand': {
          this.increaseGroup();
          writer.writePush(value);
          return;
        }
      }
      // 处理括号计算
      switch (type) {
        case 'brackets': {
          if (value === '(') {
            this.compileIfge();
            // 下一个是忽略的标记
            // 则继续处理
            while (this.isSkipNextToken()) {
              this.nextToken();
              this.compileIfge();
            }
            // 跳过闭合标签 )
            this.nextToken();
          }
          return;
        }
      }
      // 递增函数/数组的参数数量(有的话)
      switch (type) {
        case 'array': {
          // {} 这种清空不需要增加参数数量
          if (value !== '}') {
            this.increaseGroup();
          }
          this.backToken();
          return;
        }
        case 'function': {
          // func() 这种清空不需要增加参数数量
          if (value !== ')') {
            this.increaseGroup();
          }
          this.backToken();
          return;
        }
      }
      // 过滤掉运算符
      switch (type) {
        case 'operator': {
          this.backToken();
          return;
        }
      }
      // 无法识别的token
      throw new TypeError(`无法识别的token ${type} ${value} `);
    }
  }
}

/**
 * 运行函数注册
 * @type {{}}
 */
class EvalFunctions {

  /**
   * 运行函数注册
   */
  constructor() {
    this.functions = {};
  }

  /**
   * 删除函数
   * @param name
   */
  remove(name) {
    delete this.functions[name];
  }

  /**
   * 获取函数
   * @param name
   * @returns {*}
   */
  getFunction(name) {
    return this.functions[name.toLocaleString()];
  }

  /**
   * 注册函数
   * @param name
   * @param func
   */
  register(name, func) {
    this.functions[name.toLocaleString()] = func;
  }
}

/**
 * 函数注册
 * @type {EvalFunctions}
 */
const Functions = new EvalFunctions();

/**
 * 运行表达式
 */
class Evaluation {

  /**
   * Evaluate
   * @param instruct
   */
  constructor(instruct) {
    this.instruct = instruct.split('\r\n');
    this.memory = [];
  }

  /**
   * 运行表达式
   */
  eval() {
    const pushRegexp = /^push/;
    const invoke = /^invoke/;
    const newArray = /^newarray/;
    const { instruct } = this;
    instruct.forEach((name) => {
      switch (name) {
        case 'if_icmpge': {
          this.ificmpge();
          break;
        }
        case 'if_icmpgt': {
          this.ificmpgt();
          break;
        }
        case 'ifge': {
          this.ifge();
          break;
        }
        case 'ifgt': {
          this.ifgt();
          break;
        }
        case 'ifeq': {
          this.ifeq();
          break;
        }
        case 'ifne': {
          this.ifne();
          break;
        }
        case 'add': {
          this.add();
          break;
        }
        case 'sub': {
          this.sub();
          break;
        }
        case 'mul': {
          this.mul();
          break;
        }
        case 'div': {
          this.div();
          break;
        }
        case 'mod': {
          this.mod();
          break;
        }
        case 'power': {
          this.power();
          break;
        }
        case 'rel': {
          this.rel();
          break;
        }
        case 'link': {
          this.link();
          break;
        }
        case 'uni': {
          this.uni();
          break;
        }
        case 'common': {
          this.common();
          break;
        }
        default:
          if (pushRegexp.test(name)) {
            const value = name.split(' ')[1];
            this.push(value);
            break;
          }
          if (invoke.test(name)) {
            const group = name.split(' ');
            const func = group[1];
            const index = group[2];
            this.invoke(func, index);
            break;
          }
          if (newArray.test(name)) {
            const group = name.split(' ');
            const index = group[1];
            this.array(index);
            break;
          }
      }
    });
    return this.memory.pop();
  }

  /**
   * 推送操作数
   * @param value
   */
  push(value) {
    this.memory.push(parseFloat(value));
  }

  /**
   * 两个值的大于比较
   */
  ifge() {
    const b = this.memory.pop();
    const a = this.memory.pop();
    this.memory.push(a > b);
  }

  /**
   * 两个值的小于比较
   */
  ifgt() {
    const b = this.memory.pop();
    const a = this.memory.pop();
    this.memory.push(a < b);
  }

  /**
   * 两个值的相等比较
   */
  ifeq() {
    const b = this.memory.pop();
    const a = this.memory.pop();
    this.memory.push(a === b);
  }

  /**
   * 两个值的不等比较
   */
  ifne() {
    const b = this.memory.pop();
    const a = this.memory.pop();
    this.memory.push(a !== b);
  }

  /**
   * 两个值的大于等于比较
   */
  ificmpge() {
    const b = this.memory.pop();
    const a = this.memory.pop();
    this.memory.push(a >= b);
  }

  /**
   * 两个值的小于等于比较
   */
  ificmpgt() {
    const b = this.memory.pop();
    const a = this.memory.pop();
    this.memory.push(a <= b);
  }

  /**
   * 两个值的加法运算
   */
  add() {
    const b = this.memory.pop();
    const a = this.memory.pop();
    this.memory.push(a + b);
  }

  /**
   * 两个值的减法运算
   */
  sub() {
    const b = this.memory.pop();
    const a = this.memory.pop();
    this.memory.push(a - b);
  }

  /**
   * 两个值的乘法运算
   */
  mul() {
    const b = this.memory.pop();
    const a = this.memory.pop();
    this.memory.push(a * b);
  }

  /**
   * 两个值的除法运算
   */
  div() {
    const b = this.memory.pop();
    const a = this.memory.pop();
    this.memory.push(a / b);
  }

  /**
   * 两个值的mod运算
   */
  mod() {
    const b = this.memory.pop();
    const a = this.memory.pop();
    this.memory.push(a % b);
  }

  /**
   * 计算两个区域的并集
   */
  common() {
    // TODO ...
    // ....
  }

  /**
   *跨sheet引用运算
   */
  rel() {
    // TODO ...
    // ....
  }

  /**
   * 计算两个区域连接的新区域
   */
  uni() {
    // TODO ...
    // ....
  }

  /**
   * 字符串连接运算
   */
  link() {
    const b = this.memory.pop();
    const a = this.memory.pop();
    this.memory.push(`${a}${b}`);
  }

  /**
   * 乘方计算
   */
  power() {
    const b = this.memory.pop();
    const a = this.memory.pop();
    this.memory.push(Math.pow(a, b));
  }

  /**
   * 创建数组
   * @param index
   */
  array(index) {
    const array = [];
    for (let i = 1; i <= index; i++) {
      const item = this.memory.pop();
      array.push(item);
    }
    array.reverse();
    this.memory.push(array);
  }

  /**
   * 执行函数
   * @param func
   * @param index
   */
  invoke(func, index) {
    const array = [];
    for (let i = 1; i <= index; i++) {
      const item = this.memory.pop();
      array.push(item);
    }
    array.reverse();
    const execute = Functions.getFunction(func);
    const result = execute.apply(this, array);
    this.memory.push(result);
  }
}

/**
 * 编译输出指令
 * @param input
 * @returns {string|*}
 * @constructor
 */
const Compile = (input) => {
  const tokenizer = new Tokenizer();
  const assembly = new Assembly();
  const tokens = tokenizer.lexical(input);
  const compiler = new Compiler(tokens, assembly);
  return compiler.compile();
};

/**
 * 编译运行
 * @constructor
 */
const Evaluate = (input) => {
  const evaluation = new Evaluation(Compile(input));
  return evaluation.eval();
};

export {
  Tokenizer,
  Compiler,
  Assembly,
  Compile,
  Evaluate,
  Functions,
};