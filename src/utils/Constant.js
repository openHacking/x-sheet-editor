class Constant {}

Constant.EVENT_TYPE = {
  MOUSE_MOVE: 'mousemove',
  MOUSE_DOWN: 'mousedown',
  MOUSE_UP: 'mouseup',
  MOUSE_OVER: 'mouseover',
  MOUSE_LEAVE: 'mouseleave',
  MOUSE_WHEEL: 'mousewheel',
  MOUSE_ENTER: 'mouseenter',
  CLICK: 'click',
  KEY_DOWN: 'keydown',
  KEY_UP: 'keyup',
  DRAG_START: 'dragstart',
  SCROLL: 'scroll',
  RESIZE: 'resize',
  CHANGE_HEIGHT: 'changeheight',
  CHANGE_WIDTH: 'changewidth',
  CHANGE: 'change',
  stop: type => `${type}.stop`,
};

export { Constant };
