const Constant = {};
Constant.SYSTEM_EVENT_TYPE = {
  MOUSE_MOVE: 'mouseMove'.toLocaleLowerCase(),
  MOUSE_DOWN: 'mouseDown'.toLocaleLowerCase(),
  MOUSE_UP: 'mouseUp'.toLocaleLowerCase(),
  MOUSE_OVER: 'mouseOver'.toLocaleLowerCase(),
  MOUSE_LEAVE: 'mouseLeave'.toLocaleLowerCase(),
  MOUSE_WHEEL: 'mouseWheel'.toLocaleLowerCase(),
  MOUSE_ENTER: 'mouseEnter'.toLocaleLowerCase(),
  CLICK: 'click'.toLocaleLowerCase(),
  KEY_DOWN: 'keyDown'.toLocaleLowerCase(),
  KEY_UP: 'keyUp'.toLocaleLowerCase(),
  DRAG_START: 'dragStart'.toLocaleLowerCase(),
  SCROLL: 'scroll'.toLocaleLowerCase(),
  RESIZE: 'resize'.toLocaleLowerCase(),
  CHANGE: 'change'.toLocaleLowerCase(),
  INPUT: 'input'.toLocaleLowerCase(),
  VISIBILITY_CHANGE: 'visibilityChange'.toLocaleLowerCase(),
};
Constant.TABLE_EVENT_TYPE = {
  CHANGE_HEIGHT: 'tableChangeHeight'.toLocaleLowerCase(),
  CHANGE_WIDTH: 'tableChangeWidth'.toLocaleLowerCase(),
  DATA_CHANGE: 'tableDataChange'.toLocaleLowerCase(),
  SELECT_CHANGE: 'tableSelectChange'.toLocaleLowerCase(),
  SELECT_DOWN: 'tableSelectDown'.toLocaleLowerCase(),
};
Constant.WORK_BODY_EVENT_TYPE = {
  CHANGE_ACTIVE: 'workBodyChangeActive'.toLocaleLowerCase(),
};
Constant.MOUSE_POINTER_TYPE = {
  SELECT_ONE_COLUMN: {
    key: Symbol('选择一列'),
    type: 's-resize',
  },
  SELECT_ONE_ROW: {
    key: Symbol('选择一行'),
    type: 'e-resize',
  },
  SELECT_CELL: {
    key: Symbol('选择单元格'),
    type: 'cell',
  },
  AUTO_FILL: {
    key: Symbol('单元格内容自动填充'),
    type: 'crosshair',
  },
  COL_RESIZE: {
    key: Symbol('调整列宽'),
    type: 'col-resize',
  },
  ROW_RESIZE: {
    key: Symbol('调整行高'),
    type: 'row-resize',
  },
};

const cssPrefix = 'x-sheet';

export { cssPrefix };
export { Constant };
