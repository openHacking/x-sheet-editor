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
Constant.WORK_BODY_EVENT_TYPE = {
  CHANGE_ACTIVE: 'workBodyChangeActive'.toLocaleLowerCase(),
};
Constant.TABLE_EVENT_TYPE = {
  CHANGE_HEIGHT: 'tableChangeHeight'.toLocaleLowerCase(),
  DATA_CHANGE: 'tableDataChange'.toLocaleLowerCase(),
  CHANGE_WIDTH: 'tableChangeWidth'.toLocaleLowerCase(),
  SELECT_DOWN: 'tableSelectDown'.toLocaleLowerCase(),
  SCALE_CHANGE: 'scaleChange'.toLocaleLowerCase(),
  SELECT_OVER: 'tableSelectOver'.toLocaleLowerCase(),
  SELECT_CHANGE: 'tableSelectChange'.toLocaleLowerCase(),
  FIXED_CHANGE: 'fixedChange'.toLocaleLowerCase(),
};

const cssPrefix = 'x-sheet';
const XSheetVersion = 'X-Sheet 1.0.0-develop';

export { cssPrefix };
export { XSheetVersion };
export { Constant };
