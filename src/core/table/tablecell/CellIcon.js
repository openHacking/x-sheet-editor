/* global Image */
import { XDraw } from '../../../canvas/XDraw';
import { PlainUtils } from '../../../utils/PlainUtils';

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
   * @param positionX
   * @param positionY
   * @param type
   * @param image
   * @param draw
   * @param color
   * @param width
   * @param height
   * @param offset
   */
  constructor({
    positionX = CellIcon.ICON_POSITION_X.RIGHT,
    positionY = CellIcon.ICON_POSITION_Y.CENTER,
    type = CellIcon.ICON_TYPE.image,
    image = PlainUtils.Nul,
    color = '#ffffff',
    width = 20,
    height = 20,
    draw = () => {},
    offset = { x: 0, y: 0 },
  }) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.type = type;
    this.width = width;
    this.height = height;
    this.draw = draw;
    this.image = image;
    this.color = color;
    this.offset = offset;
  }

  /**
   * 加载图片信息
   * @param async
   * @param sync
   */
  loadImage({
    async, sync,
  }) {
    const { image, type } = this;
    switch (type) {
      case CellIcon.ICON_TYPE.image:
        if (image instanceof Image) {
          sync(image);
        } else {
          const load = new Image();
          load.src = image;
          load.onload = () => {
            this.image = load;
            async(load);
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
   * @param icon
   * @param draw
   */
  drawIcon({
    rect, icon, draw,
  }) {
    const { type } = this;
    switch (type) {
      case CellIcon.ICON_TYPE.image:
        this.drawImage(rect, icon, draw);
        break;
      case CellIcon.ICON_TYPE.draw:
        this.drawCustom(rect, icon, draw);
        break;
    }
  }

  /**
   * 自定义绘制
   * @param rect
   * @param icon
   * @param draw
   */
  drawCustom(rect, icon, draw) {
    this.draw(rect, icon, draw);
  }

  /**
   * 绘制图片
   * @param rect
   * @param icon
   * @param draw
   */
  drawImage(rect, icon, draw) {
    // 图标位置
    const iconPositionX = icon.positionX;
    const iconPositionY = icon.positionY;
    const iconColor = icon.color;
    const iconSourceWidth = icon.width;
    const iconSourceHeight = icon.height;
    const iconImage = icon.image;
    const iconX = XDraw.transformStylePx(icon.offset.x);
    const iconY = XDraw.transformStylePx(icon.offset.y);
    const iconWidth = XDraw.transformStylePx(iconSourceWidth);
    const iconHeight = XDraw.transformStylePx(iconSourceHeight);
    // 矩形位置
    const rectX = rect.x;
    const rectY = rect.y;
    const rectWidth = rect.width;
    const rectHeight = rect.height;
    // 计算位置
    let ix = 0;
    let iy = 0;
    switch (iconPositionX) {
      case CellIcon.ICON_POSITION_X.CENTER:
        ix = (rectX + rectWidth / 2) - (iconWidth / 2);
        break;
      case CellIcon.ICON_POSITION_X.LEFT:
        ix = rectX;
        break;
      case CellIcon.ICON_POSITION_X.RIGHT:
        ix = rectX + rectWidth - iconWidth;
        break;
    }
    switch (iconPositionY) {
      case CellIcon.ICON_POSITION_Y.CENTER:
        iy = (rectY + rectHeight / 2) - (iconHeight / 2);
        break;
      case CellIcon.ICON_POSITION_Y.TOP:
        iy = rectY;
        break;
      case CellIcon.ICON_POSITION_Y.BOTTOM:
        iy = rectY + rectHeight - iconHeight;
        break;
    }
    ix += iconX;
    iy += iconY;
    // 绘制背景和图标
    draw.attr({ fillStyle: iconColor });
    draw.fillRect(ix, iy, iconWidth, iconHeight);
    draw.drawImage(iconImage, 0, 0, iconSourceWidth, iconSourceHeight,
      ix, iy, iconWidth, iconHeight);
  }

}
CellIcon.ICON_POSITION_X = {
  LEFT: 0,
  RIGHT: 1,
  CENTER: 2,
};
CellIcon.ICON_POSITION_Y = {
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
