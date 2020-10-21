/* global Image console */
import { PlainUtils } from '../../../utils/PlainUtils';
import { XDraw } from '../../../canvas/XDraw';

/**
 * CellIconOffset
 */
class CellIconOffset {

  /**
   * CellIconOffset
   * @param x
   * @param y
   */
  constructor({ x = 0, y = 0 } = {}) {
    this.x = x;
    this.y = y;
  }

}

/**
 * CellIcon
 * @author jerry
 * @date 2020/10/20
 */
class CellIcon {

  /**
   * 多图标初始化
   * @param icons
   * @returns {[]}
   */
  static newInstances(icons = []) {
    const instances = [];
    for (let i = 0; i < icons.length; i += 1) {
      const icon = icons[i];
      instances.push(new CellIcon(icon));
    }
    return instances;
  }

  /**
   * CellIcon
   * @param horizontal
   * @param vertical
   * @param type
   * @param image
   * @param draw
   * @param color
   * @param width
   * @param height
   * @param offset
   */
  constructor({
    vertical = CellIcon.ICON_VERTICAL.CENTER,
    horizontal = CellIcon.ICON_HORIZONTAL.RIGHT,
    type = CellIcon.ICON_TYPE.image,
    image = PlainUtils.Nul,
    color = '#ffffff',
    width = 16,
    height = 16,
    draw = () => {},
    offset = { x: 0, y: 0 },
  }) {
    this.horizontal = horizontal;
    this.vertical = vertical;
    this.type = type;
    this.width = width;
    this.height = height;
    this.draw = draw;
    this.image = image;
    this.color = color;
    this.offset = new CellIconOffset(offset);
  }

  /**
   * 计算绘制坐标
   * @param rect
   * @returns {{x: number, y: number}}
   */
  position(rect) {
    // 图标信息
    const iconSourceWidth = this.width;
    const iconSourceHeight = this.height;
    const iconHorizontal = this.horizontal;
    const iconVertical = this.vertical;
    const iconX = XDraw.transformStylePx(this.offset.x);
    const iconY = XDraw.transformStylePx(this.offset.y);
    const iconWidth = XDraw.transformStylePx(iconSourceWidth);
    const iconHeight = XDraw.transformStylePx(iconSourceHeight);
    // 矩形位置
    const rectX = rect.x;
    const rectY = rect.y;
    const rectWidth = rect.width;
    const rectHeight = rect.height;
    // 计算位置
    let px = 0;
    let py = 0;
    switch (iconHorizontal) {
      case CellIcon.ICON_HORIZONTAL.CENTER:
        px = (rectX + rectWidth / 2) - (iconWidth / 2);
        break;
      case CellIcon.ICON_HORIZONTAL.LEFT:
        px = rectX;
        break;
      case CellIcon.ICON_HORIZONTAL.RIGHT:
        px = rectX + rectWidth - iconWidth;
        break;
    }
    switch (iconVertical) {
      case CellIcon.ICON_VERTICAL.CENTER:
        py = (rectY + rectHeight / 2) - (iconHeight / 2);
        break;
      case CellIcon.ICON_VERTICAL.TOP:
        py = rectY;
        break;
      case CellIcon.ICON_VERTICAL.BOTTOM:
        py = rectY + rectHeight - iconHeight;
        break;
    }
    px += iconX;
    py += iconY;
    return {
      x: px, y: py, width: iconWidth, height: iconHeight,
    };
  }

  /**
   * 加载图片信息
   * @param async
   * @param sync
   */
  loadImage({
    load, sync,
  }) {
    const { image, type } = this;
    switch (type) {
      case CellIcon.ICON_TYPE.image:
        if (image instanceof Image) {
          sync(image);
        } else {
          const loadImg = new Image();
          loadImg.src = image;
          loadImg.onload = () => {
            this.image = loadImg;
            load(loadImg);
          };
          loadImg.onerror = () => {
            // eslint-disable-next-line no-console
            console.error(`图片加载失败${image}`);
          };
        }
        break;
      case CellIcon.ICON_TYPE.draw:
        sync();
        break;
    }
  }

  /**
   * 绘制小图标
   * @param rect
   * @param draw
   */
  drawIcon({
    rect, draw,
  }) {
    const { type } = this;
    switch (type) {
      case CellIcon.ICON_TYPE.image:
        this.drawImage({
          rect, draw,
        });
        break;
      case CellIcon.ICON_TYPE.draw:
        this.drawCustom({
          rect, draw,
        });
        break;
    }
  }

  /**
   * 自定义绘制
   * @param rect
   * @param icon
   * @param draw
   */
  drawCustom({
    rect, draw,
  }) {
    this.draw({
      rect, draw,
    });
  }

  /**
   * 绘制图片
   * @param rect
   * @param icon
   * @param draw
   */
  drawImage({
    rect, draw,
  }) {
    const image = this.image;
    const color = this.color;
    const { x, y, width, height } = this.position(rect);
    draw.attr({ fillStyle: color });
    draw.fillRect(x, y, width, height);
    draw.drawImage(image,
      0, 0, image.width, image.height, x, y, width, height);
  }

}
CellIcon.ICON_HORIZONTAL = {
  LEFT: 0,
  RIGHT: 1,
  CENTER: 2,
};
CellIcon.ICON_VERTICAL = {
  TOP: 3,
  BOTTOM: 4,
  CENTER: 5,
};
CellIcon.ICON_TYPE = {
  image: 1,
  custom: 2,
};

export {
  CellIcon,
};
