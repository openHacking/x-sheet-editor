const Constant = {};
const XSheetVersion = 'X-Sheet 1.0.0-develop';
const cssPrefix = 'x-sheet';
Constant.WORK_BODY_EVENT_TYPE = {
  CHANGE_ACTIVE: 'changeactive',
};
Constant.SYSTEM_EVENT_TYPE = {
  MOUSE_MOVE: 'mousemove',
  MOUSE_DOWN: 'mousedown',
  SCROLL: 'scroll',
  RESIZE: 'resize',
  MOUSE_UP: 'mouseup',
  KEY_UP: 'keyup',
  INPUT: 'input',
  KEY_DOWN: 'keydown',
  MOUSE_OVER: 'mouseover',
  MOUSE_LEAVE: 'mouseleave',
  MOUSE_WHEEL: 'wheel',
  MOUSE_ENTER: 'mouseenter',
  CLICK: 'click',
  DRAG_START: 'dragstart',
  CHANGE: 'change',
  VISIBILITY_CHANGE: 'visibilitychange',
};
Constant.TABLE_EVENT_TYPE = {
  CHANGE_HEIGHT: 'changeheight',
  SELECT_OVER: 'selectover',
  SCALE_CHANGE: 'scalechange',
  FIXED_CHANGE: 'fixedchange',
  SELECT_DOWN: 'selectdown',
  SELECT_CHANGE: 'selectchange',
  DATA_CHANGE: 'datachange',
  CHANGE_WIDTH: 'changewidth',
  RESIZE_CHANGE: 'resizechange',
  RENDER: 'render',
};
export {
  XSheetVersion,
  cssPrefix,
  Constant,
};
