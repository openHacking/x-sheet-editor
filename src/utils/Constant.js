class Constant {}

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
};

Constant.TABLE_EVENT_TYPE = {
  CHANGE_HEIGHT: 'tableChangeHeight'.toLocaleLowerCase(),
  CHANGE_WIDTH: 'tableChangeWidth'.toLocaleLowerCase(),
  DATA_CHANGE: 'tableDataChange'.toLocaleLowerCase(),
};

export { Constant };
