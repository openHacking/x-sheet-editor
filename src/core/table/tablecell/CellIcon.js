/* global Image */

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
    for (let i = 0; i <= icons; i += 1) {
      const icon = icons[i];
      instances.push(new CellIcon(icon));
    }
    return instances;
  }

  /**
   * CellIcon
   * @param positionX
   * @param positionY
   * @param width
   * @param height
   * @param offset
   * @param image
   * @param color
   */
  constructor({
    positionX = CellIcon.ICON_POSITION_X.RIGHT,
    positionY = CellIcon.ICON_POSITION_Y.CENTER,
    width = 20,
    height = 20,
    image = null,
    color = '#ffffff',
    offset = { x: 0, y: 0 },
  }) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.width = width;
    this.height = height;
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
    async,
    sync,
  }) {
    const { image } = this;
    if (image instanceof Image) {
      sync(image);
    }
    const load = new Image();
    load.src = image;
    load.onload = () => {
      this.image = load;
      async(load);
    };
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

export {
  CellIcon,
};
