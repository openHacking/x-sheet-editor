import { BaseFont } from './BaseFont';
import { Utils } from '../../utils/Utils';
import { RTCosKit, RTSinKit } from '../RTFunction';
import { Angle } from '../Angle';
import { Rect } from '../Rect';
import { Crop } from '../Crop';
import { ALIGN, VERTICAL_ALIGN } from '../Font';

class AngleFont extends BaseFont {

  constructor({
    overflow,
    text,
    rect,
    dw,
    attr,
  }) {
    super({
      overflow,
      text,
      rect,
      dw,
      attr,
    });
    this.attr = Utils.mergeDeep({
      lineHeight: 4,
    }, this.attr);
  }

  truncateFont() {
    this.overflowFont();
  }

  overflowFont() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, size, padding, lineHeight,
    } = attr;
    let { angle } = attr;
    if (angle > 90) {
      angle = 90;
    }
    if (angle < -90) {
      angle = -90;
    }
    const { width, height } = rect;
    if (angle > 0) {
      // 计算斜角文本的最大绘制宽度
      // 超过绘制宽度自动换行
      const textHypotenuseWidth = RTSinKit.tilt({
        inverse: height - padding * 2,
        angle,
      });

      // 计算文本块之间的间隙
      const spacing = RTSinKit.tilt({
        inverse: size + lineHeight,
        angle,
      });

      // 折行文本计算
      const textArray = [];
      const line = {
        len: 0,
        start: 0,
      };
      const len = text.length;
      let i = 0;
      while (i < len) {
        const charWidth = this.measureWidth(text.charAt(i));
        const textWidth = line.len + charWidth;
        if (textWidth > textHypotenuseWidth) {
          if (line.len === 0) {
            textArray.push({
              text: text.substring(i, i + 1),
              len: textWidth,
              tx: 0,
              ty: 0,
            });
            i += 1;
          } else {
            textArray.push({
              text: text.substring(line.start, i),
              len: line.len,
              tx: 0,
              ty: 0,
            });
          }
          line.len = 0;
          line.start = i;
        } else {
          line.len = textWidth;
          i += 1;
        }
      }
      if (line.len > 0) {
        textArray.push({
          text: text.substring(line.start),
          len: line.len,
          tx: 0,
          ty: 0,
        });
      }
      const textArrayLen = textArray.length;

      // 每个文本块的x坐标
      // 加上指定的间隙
      let wOffset = 0;
      for (let i = 0; i < textArrayLen; i += 1) {
        const item = textArray[i];
        item.tx = wOffset;
        wOffset += spacing;
      }

      // 多行文本和单行文本
      // 采用不同的绘制
      // 逻辑
      if (textArrayLen > 1) {
        // 计算每个文本块的
        // 宽度和高度
        const textWidth = Math.max(RTCosKit.nearby({
          tilt: textHypotenuseWidth,
          angle,
        }), size);
        const textHeight = RTSinKit.inverse({
          tilt: textHypotenuseWidth,
          angle,
        });

        // 计算总宽度
        const totalWidth = textWidth + ((textArray.length - 1) * spacing);
        let bx = rect.x;
        let by = rect.y;
        switch (align) {
          case ALIGN.left:
            bx += padding;
            break;
          case ALIGN.center:
            bx += width / 2 - totalWidth / 2;
            break;
          case ALIGN.right:
            bx += width - totalWidth - padding;
            break;
          default:
            break;
        }
        switch (verticalAlign) {
          case VERTICAL_ALIGN.top:
            by += padding;
            break;
          case VERTICAL_ALIGN.center:
            by += height / 2 - textHeight / 2;
            break;
          case VERTICAL_ALIGN.bottom:
            by += height - textHeight - padding;
            break;
          default:
            break;
        }
        let contentWidth;
        switch (align) {
          case ALIGN.right:
          case ALIGN.left:
            contentWidth = totalWidth + padding * 2;
            break;
          case ALIGN.center:
          default:
            contentWidth = totalWidth;
        }

        // 渲染文本
        for (let i = 0; i < textArray.length; i += 1) {
          // 计算文本的
          // 绘制位置
          // 旋转中心
          const item = textArray[i];
          const rx = item.tx + bx;
          const ry = item.ty + by;
          let ax = 0;
          let ay = 0;
          switch (align) {
            case ALIGN.left: {
              const tilt = item.len / 2;
              const tw = Math.max(RTCosKit.nearby({
                tilt,
                angle,
              }), size);
              const th = RTSinKit.inverse({
                tilt,
                angle,
              });
              ax += rx + tw;
              ay += ry + textHeight - th;
              break;
            }
            case ALIGN.center: {
              ax = rx + textWidth / 2;
              ay = ry + textHeight / 2;
              break;
            }
            case ALIGN.right: {
              const tilt = item.len / 2;
              const tw = Math.max(RTCosKit.nearby({
                tilt,
                angle,
              }), size);
              const th = RTSinKit.inverse({
                tilt,
                angle,
              });
              ax += rx + textWidth - tw;
              ay += ry + th;
              break;
            }
            default:
              break;
          }
          const tx = ax - item.len / 2;
          const ty = ay - size / 2;

          // 旋转并且
          // 绘制文本
          if (i === -1) {
            dw.attr({ fillStyle: '#000000' });
            dw.fillRect(rx, ry, textWidth, textHeight);
            dw.attr({ fillStyle: 'red' });
          }
          const dwAngle = new Angle({
            dw,
            angle,
            rect: new Rect({
              x: tx,
              y: ty,
              width: item.len,
              height: size,
            }),
          });
          dwAngle.rotate();
          dw.fillText(item.text, tx, ty);
          if (underline) {
            this.drawLine('underline', tx, ty, item.len);
          }
          if (strikethrough) {
            this.drawLine('strike', tx, ty, item.len);
          }
          dwAngle.revert();
        }
        return contentWidth;
      }

      // 计算文本块的
      // 大小
      const textWidth = this.measureWidth(text);
      const trigonometricWidth = Math.max(RTCosKit.nearby({
        tilt: textWidth,
        angle,
      }), size);
      const trigonometricHeight = RTSinKit.inverse({
        tilt: textWidth,
        angle,
      });

      // 计算文本
      // 绘制位置
      // 旋转中心
      let rtx = rect.x;
      let rty = rect.y;
      switch (align) {
        case ALIGN.left:
          rtx += padding;
          break;
        case ALIGN.center:
          rtx += width / 2 - trigonometricWidth / 2;
          break;
        case ALIGN.right:
          rtx += width - trigonometricWidth - padding;
          break;
        default:
          break;
      }
      switch (verticalAlign) {
        case VERTICAL_ALIGN.top:
          rty += padding;
          break;
        case VERTICAL_ALIGN.center:
          rty += height / 2 - trigonometricHeight / 2;
          break;
        case VERTICAL_ALIGN.bottom:
          rty += height - trigonometricHeight - padding;
          break;
        default:
          break;
      }
      let contentWidth;
      switch (align) {
        case ALIGN.right:
        case ALIGN.left:
          contentWidth = trigonometricWidth + padding * 2;
          break;
        case ALIGN.center:
        default:
          contentWidth = trigonometricWidth;
      }

      // 旋转并且
      // 绘制文本
      const dwAngle = new Angle({
        dw,
        angle,
        rect: new Rect({
          x: rtx,
          y: rty,
          width: trigonometricWidth,
          height: trigonometricHeight,
        }),
      });
      dwAngle.rotate();
      const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
      const ty = rty + (trigonometricHeight / 2 - size / 2);
      dw.fillText(text, tx, ty);
      if (underline) {
        this.drawLine('underline', tx, ty, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', tx, ty, textWidth);
      }
      dwAngle.revert();
      return contentWidth;
    }
    if (angle < 0) {
      // 计算斜角文本的最大绘制宽度
      // 超过绘制宽度自动换行
      const textHypotenuseWidth = RTSinKit.tilt({
        inverse: height - padding * 2,
        angle,
      });

      // 计算文本块之间的间隙
      const spacing = RTSinKit.tilt({
        inverse: size + lineHeight,
        angle,
      });

      // 折行文本计算
      const textArray = [];
      const line = {
        len: 0,
        start: 0,
      };
      const len = text.length;
      let i = 0;
      while (i < len) {
        const charWidth = this.measureWidth(text.charAt(i));
        const textWidth = line.len + charWidth;
        if (textWidth > textHypotenuseWidth) {
          if (line.len === 0) {
            textArray.push({
              text: text.substring(i, i + 1),
              len: textWidth,
              tx: 0,
              ty: 0,
            });
            i += 1;
          } else {
            textArray.push({
              text: text.substring(line.start, i),
              len: line.len,
              tx: 0,
              ty: 0,
            });
          }
          line.len = 0;
          line.start = i;
        } else {
          line.len = textWidth;
          i += 1;
        }
      }
      if (line.len > 0) {
        textArray.push({
          text: text.substring(line.start),
          len: line.len,
          tx: 0,
          ty: 0,
        });
      }
      const textArrayLen = textArray.length;

      // 每个文本块的x坐标
      // 加上指定的间隙
      let wOffset = 0;
      for (let i = textArrayLen - 1; i >= 0; i -= 1) {
        const item = textArray[i];
        item.tx = wOffset;
        wOffset += spacing;
      }

      // 多行文本和单行文本
      // 采用不同的绘制
      // 逻辑
      if (textArrayLen > 1) {
        // 计算每个文本块的
        // 宽度和高度
        const textWidth = Math.max(RTCosKit.nearby({
          tilt: textHypotenuseWidth,
          angle,
        }), size);
        const textHeight = RTSinKit.inverse({
          tilt: textHypotenuseWidth,
          angle,
        });

        // 文本总宽度
        const totalWidth = textWidth + ((textArray.length - 1) * spacing);
        let bx = rect.x;
        let by = rect.y;
        switch (align) {
          case ALIGN.left:
            bx += padding;
            break;
          case ALIGN.center:
            bx += width / 2 - totalWidth / 2;
            break;
          case ALIGN.right:
            bx += width - totalWidth - padding;
            break;
          default:
            break;
        }
        switch (verticalAlign) {
          case VERTICAL_ALIGN.top:
            by += padding;
            break;
          case VERTICAL_ALIGN.center:
            by += height / 2 - textHeight / 2;
            break;
          case VERTICAL_ALIGN.bottom:
            by += height - textHeight - padding;
            break;
          default:
            break;
        }
        let contentWidth;
        switch (align) {
          case ALIGN.right:
          case ALIGN.left:
            contentWidth = totalWidth + padding * 2;
            break;
          case ALIGN.center:
          default:
            contentWidth = totalWidth;
        }

        // 渲染文本
        for (let i = 0; i < textArray.length; i += 1) {
          // 计算文本的
          // 绘制位置
          // 旋转中心
          const item = textArray[i];
          const rx = item.tx + bx;
          const ry = item.ty + by;
          let ax = 0;
          let ay = 0;
          switch (align) {
            case ALIGN.left: {
              const tilt = item.len / 2;
              const tw = Math.max(RTCosKit.nearby({
                tilt,
                angle,
              }), size);
              const th = RTSinKit.inverse({
                tilt,
                angle,
              });
              ax += rx + tw;
              ay += ry + th;
              break;
            }
            case ALIGN.center: {
              ax = rx + textWidth / 2;
              ay = ry + textHeight / 2;
              break;
            }
            case ALIGN.right: {
              const tilt = item.len / 2;
              const tw = Math.max(RTCosKit.nearby({
                tilt,
                angle,
              }), size);
              const th = RTSinKit.inverse({
                tilt,
                angle,
              });
              ax += rx + textWidth - tw;
              ay += ry + textHeight - th;
              break;
            }
            default:
              break;
          }
          const tx = ax - item.len / 2;
          const ty = ay - size / 2;
          if (i === -1) {
            dw.attr({ fillStyle: '#000000' });
            dw.fillRect(rx, ry, textWidth, textHeight);
            dw.attr({ fillStyle: 'red' });
          }

          // 旋转并且
          // 绘制文本
          const dwAngle = new Angle({
            dw,
            angle,
            rect: new Rect({
              x: tx,
              y: ty,
              width: item.len,
              height: size,
            }),
          });
          dwAngle.rotate();
          dw.fillText(item.text, tx, ty);
          if (underline) {
            this.drawLine('underline', tx, ty, item.len);
          }
          if (strikethrough) {
            this.drawLine('strike', tx, ty, item.len);
          }
          dwAngle.revert();
        }
        return contentWidth;
      }

      // 计算文本块的
      // 大小
      const textWidth = this.measureWidth(text);
      const trigonometricWidth = Math.max(RTCosKit.nearby({
        tilt: textWidth,
        angle,
      }), size);
      const trigonometricHeight = RTSinKit.inverse({
        tilt: textWidth,
        angle,
      });

      // 计算文本
      // 绘制位置
      // 旋转中心
      let rtx = rect.x;
      let rty = rect.y;
      switch (align) {
        case ALIGN.left:
          rtx += padding;
          break;
        case ALIGN.center:
          rtx += width / 2 - trigonometricWidth / 2;
          break;
        case ALIGN.right:
          rtx += width - trigonometricWidth - padding;
          break;
        default:
          break;
      }
      switch (verticalAlign) {
        case VERTICAL_ALIGN.top:
          rty += padding;
          break;
        case VERTICAL_ALIGN.center:
          rty += height / 2 - trigonometricHeight / 2;
          break;
        case VERTICAL_ALIGN.bottom:
          rty += height - trigonometricHeight - padding;
          break;
        default:
          break;
      }
      let contentWidth;
      switch (align) {
        case ALIGN.right:
        case ALIGN.left:
          contentWidth = trigonometricWidth + padding * 2;
          break;
        case ALIGN.center:
        default:
          contentWidth = trigonometricWidth;
      }

      // 旋转并且
      // 绘制文本
      const dwAngle = new Angle({
        dw,
        angle,
        rect: new Rect({
          x: rtx,
          y: rty,
          width: trigonometricWidth,
          height: trigonometricHeight,
        }),
      });
      dwAngle.rotate();
      const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
      const ty = rty + (trigonometricHeight / 2 - size / 2);
      dw.fillText(text, tx, ty);
      if (underline) {
        this.drawLine('underline', tx, ty, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', tx, ty, textWidth);
      }
      dwAngle.revert();
      return contentWidth;
    }
    if (angle === 0) {
      const maxTextWidth = width - padding * 2;
      const textArray = [];
      const line = {
        len: 0,
        start: 0,
      };
      const len = text.length;

      // 折行
      let i = 0;
      let maxLen = 0;
      while (i < len) {
        const charWidth = this.measureWidth(text.charAt(i));
        const textWidth = line.len + charWidth;
        if (textWidth > maxTextWidth) {
          if (line.len === 0) {
            textArray.push({
              text: text.substring(i, i + 1),
              len: textWidth,
              tx: 0,
              ty: 0,
            });
            i += 1;
            if (textWidth > maxLen) {
              maxLen = textWidth;
            }
          } else {
            textArray.push({
              text: text.substring(line.start, i),
              len: line.len,
              tx: 0,
              ty: 0,
            });
            if (line.len > maxLen) {
              maxLen = line.len;
            }
          }
          line.len = 0;
          line.start = i;
        } else {
          line.len = textWidth;
          i += 1;
        }
      }
      if (line.len > 0) {
        textArray.push({
          text: text.substring(line.start),
          len: line.len,
          tx: 0,
          ty: 0,
        });
        if (line.len > maxLen) {
          maxLen = line.len;
        }
      }
      const textArrayLen = textArray.length;

      // 位置计算
      let hOffset = 0;
      for (let i = 0; i < textArrayLen; i += 1) {
        const item = textArray[i];
        item.ty = hOffset;
        hOffset += size + lineHeight;
      }
      const totalTextHeight = textArrayLen * (size + lineHeight);

      let contentWidth;
      switch (align) {
        case ALIGN.right:
        case ALIGN.left:
          contentWidth = maxLen + padding * 2;
          break;
        case ALIGN.center:
        default:
          contentWidth = maxLen;
      }
      // 裁剪 绘制
      const crop = new Crop({
        draw: dw,
        rect,
      });
      crop.open();
      for (let i = 0; i < textArrayLen; i += 1) {
        const item = textArray[i];
        let tx = rect.x;
        let ty = rect.y;
        switch (align) {
          case ALIGN.left:
            tx += padding;
            break;
          case ALIGN.center:
            tx += width / 2 - item.len / 2;
            break;
          case ALIGN.right:
            tx += width - item.len - padding;
            break;
          default:
            break;
        }
        switch (verticalAlign) {
          case VERTICAL_ALIGN.top:
            ty += item.ty + padding;
            break;
          case VERTICAL_ALIGN.center:
            ty += item.ty + (height / 2 - totalTextHeight / 2);
            break;
          case VERTICAL_ALIGN.bottom:
            ty += item.ty + (height - totalTextHeight - padding);
            break;
          default:
            break;
        }
        dw.fillText(item.text, tx, ty);
        if (underline) {
          this.drawLine('underline', tx, ty, item.len);
        }
        if (strikethrough) {
          this.drawLine('strike', tx, ty, item.len);
        }
      }
      crop.close();
      return contentWidth;
    }
    return 0;
  }

  wrapTextFont() {}

}
