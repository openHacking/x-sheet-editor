import { BaseFont } from './BaseFont';
import { PlainUtils } from '../../utils/PlainUtils';
import { RTCosKit, RTSinKit } from '../RTFunction';
import { Angle } from '../Angle';
import { Rect } from '../Rect';
import { Crop } from '../Crop';

class AngleFont extends BaseFont {

  constructor({
    overflow, text, rect, dw, attr,
  }) {
    super({
      overflow, text, rect, dw, attr,
    });
    this.attr = PlainUtils.mergeDeep({
      lineHeight: 4,
    }, this.attr);

  }

  drawLine(type, tx, ty, textWidth) {
    const { dw, attr } = this;
    const { size } = attr;
    const s = [0, 0];
    const e = [0, 0];
    if (type === 'strike') {
      s[0] = tx;
      e[0] = tx + textWidth;
      s[1] = ty + size / 2;
      e[1] = ty + size / 2;
    }
    if (type === 'underline') {
      s[0] = tx;
      e[0] = tx + textWidth;
      s[1] = ty + size;
      e[1] = ty + size;
    }
    dw.line(s, e);
  }

  draw() {
    const { text } = this;
    if (this.isBlank(text)) {
      return 0;
    }
    const { dw, attr } = this;
    const { textWrap, angle } = attr;
    dw.attr({
      textAlign: BaseFont.ALIGN.left,
      textBaseline: BaseFont.VERTICAL_ALIGN.top,
      font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${attr.size}px ${attr.name}`,
      fillStyle: attr.color,
      strokeStyle: attr.color,
    });
    if (angle === 0) {
      dw.attr({
        textAlign: attr.align,
        textBaseline: attr.verticalAlign,
      });
    } else {
      dw.attr({
        textAlign: BaseFont.ALIGN.left,
        textBaseline: BaseFont.VERTICAL_ALIGN.top,
      });
    }
    switch (textWrap) {
      case BaseFont.TEXT_WRAP.OVER_FLOW:
        return this.overflowFont();
      case BaseFont.TEXT_WRAP.TRUNCATE:
        return this.truncateFont();
      case BaseFont.TEXT_WRAP.WORD_WRAP:
        return this.wrapTextFont();
    }
    return 0;
  }

  truncateFont() {
    this.overflowFont();
  }

  overflowFont() {
    const {
      text, dw, attr, rect,
    } = this;
    let { overflow } = this;
    if (!overflow) {
      overflow = rect;
    }
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
      // 折行文本计算
      const breakArray = this.textBreak(text);
      const textArray = [];
      const breakLen = breakArray.length;
      let bi = 0;
      let maxLen = 0;
      while (bi < breakLen) {
        const text = breakArray[bi];
        const textWidth = this.textWidth(text);
        if (textWidth > maxLen) {
          maxLen = textWidth;
        }
        textArray.push({
          text,
          len: textWidth,
          tx: 0,
          ty: 0,
        });
        bi += 1;
      }
      const textArrayLen = textArray.length;
      // 多行文本
      if (textArrayLen > 1) {
        // 文本间隙
        const spacing = RTSinKit.tilt({
          inverse: size + lineHeight,
          angle,
        });
        // 文本宽高
        const textWidth = Math.max(RTCosKit.nearby({
          tilt: maxLen,
          angle,
        }), size);
        const textHeight = RTSinKit.inverse({
          tilt: maxLen,
          angle,
        });
        // 总宽度
        const totalWidth = textWidth + ((textArrayLen - 1) * spacing);
        // x坐标偏移量
        let wOffset = 0;
        let ii = 0;
        while (ii < textArrayLen) {
          const item = textArray[ii];
          item.tx = wOffset;
          wOffset += spacing;
          ii += 1;
        }
        // 文本坐标
        let bx = rect.x;
        let by = rect.y;
        let pw = 0;
        let ph = 0;
        switch (align) {
          case BaseFont.ALIGN.center:
            bx += width / 2 - totalWidth / 2;
            pw = 0;
            break;
          case BaseFont.ALIGN.left:
            bx += padding;
            pw = padding;
            break;
          case BaseFont.ALIGN.right:
            bx += width - totalWidth - padding;
            pw = padding;
            break;
        }
        switch (verticalAlign) {
          case BaseFont.VERTICAL_ALIGN.center:
            by += height / 2 - textHeight / 2;
            ph = 0;
            break;
          case BaseFont.VERTICAL_ALIGN.top:
            by += padding;
            ph = padding;
            break;
          case BaseFont.VERTICAL_ALIGN.bottom:
            by += height - textHeight - padding;
            ph = padding;
            break;
        }
        // 边界检查
        const outbounds = totalWidth + pw > overflow.width
          || textHeight + ph > overflow.height;
        if (outbounds) {
          // 裁剪宽度
          const crop = new Crop({
            draw: dw,
            rect: overflow,
          });
          crop.open();
          // 渲染文本
          let jj = 0;
          while (jj < textArrayLen) {
            // 计算文本的 绘制位置 旋转中心
            const item = textArray[jj];
            const rx = item.tx + bx;
            const ry = item.ty + by;
            let ax = 0;
            let ay = 0;
            switch (align) {
              case BaseFont.ALIGN.center: {
                ax = rx + textWidth / 2;
                ay = ry + textHeight / 2;
                break;
              }
              case BaseFont.ALIGN.left: {
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
              case BaseFont.ALIGN.right: {
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
            }
            const tx = ax - item.len / 2;
            const ty = ay - size / 2;
            // 旋转并且 绘制文本
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
            jj += 1;
          }
          crop.close();
        } else {
          // 渲染文本
          let jj = 0;
          while (jj < textArrayLen) {
            // 计算文本的 绘制位置 旋转中心
            const item = textArray[jj];
            const rx = item.tx + bx;
            const ry = item.ty + by;
            let ax = 0;
            let ay = 0;
            switch (align) {
              case BaseFont.ALIGN.center: {
                ax = rx + textWidth / 2;
                ay = ry + textHeight / 2;
                break;
              }
              case BaseFont.ALIGN.left: {
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
              case BaseFont.ALIGN.right: {
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
            }
            const tx = ax - item.len / 2;
            const ty = ay - size / 2;
            // 旋转并且 绘制文本
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
            jj += 1;
          }
        }
        // 文本占据的宽度(padding)
        let haveWidth;
        switch (align) {
          case BaseFont.ALIGN.center:
            haveWidth = totalWidth;
            break;
          case BaseFont.ALIGN.right:
          case BaseFont.ALIGN.left:
            haveWidth = totalWidth + padding;
            break;
        }
        return haveWidth;
      }
      // 文本大小
      const textWidth = this.textWidth(text);
      const trigonometricWidth = Math.max(RTCosKit.nearby({
        tilt: textWidth,
        angle,
      }), size);
      const trigonometricHeight = RTSinKit.inverse({
        tilt: textWidth,
        angle,
      });
      // 文本坐标
      let rtx = rect.x;
      let rty = rect.y;
      let pw = 0;
      let ph = 0;
      switch (align) {
        case BaseFont.ALIGN.center:
          rtx += width / 2 - trigonometricWidth / 2;
          pw = 0;
          break;
        case BaseFont.ALIGN.left:
          rtx += padding;
          pw = padding;
          break;
        case BaseFont.ALIGN.right:
          rtx += width - trigonometricWidth - padding;
          pw = padding;
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.center:
          rty += height / 2 - trigonometricHeight / 2;
          ph = 0;
          break;
        case BaseFont.VERTICAL_ALIGN.top:
          rty += padding;
          ph = padding;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          rty += height - trigonometricHeight - padding;
          ph = padding;
          break;
      }
      // 边界检查
      const outbounds = trigonometricWidth + pw > overflow.width
        || trigonometricHeight + ph > overflow.height;
      if (outbounds) {
        // 裁剪宽度
        const crop = new Crop({
          draw: dw,
          rect: overflow,
        });
        crop.open();
        // 旋转并且绘制文本
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
        crop.close();
      } else {
        // 旋转并且绘制文本
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
      }
      // 计算文本占据的宽度(padding)
      let haveWidth = 0;
      switch (align) {
        case BaseFont.ALIGN.center:
          haveWidth = trigonometricWidth;
          break;
        case BaseFont.ALIGN.right:
        case BaseFont.ALIGN.left:
          haveWidth = trigonometricWidth + padding;
          break;
      }
      return haveWidth;
    }
    if (angle < 0) {
      // 折行文本计算
      const breakArray = this.textBreak(text);
      const textArray = [];
      const breakLen = breakArray.length;
      let bi = 0;
      let maxLen = 0;
      while (bi < breakLen) {
        const text = breakArray[bi];
        const textWidth = this.textWidth(text);
        if (textWidth > maxLen) {
          maxLen = textWidth;
        }
        textArray.push({
          text,
          len: textWidth,
          tx: 0,
          ty: 0,
        });
        bi += 1;
      }
      const textArrayLen = textArray.length;
      // 多行文本
      if (textArrayLen > 1) {
        // 计算文本块之间的间隙
        const spacing = RTSinKit.tilt({
          inverse: size + lineHeight,
          angle,
        });
        // 计算每个文本块宽度和高度
        const textWidth = Math.max(RTCosKit.nearby({
          tilt: maxLen,
          angle,
        }), size);
        const textHeight = RTSinKit.inverse({
          tilt: maxLen,
          angle,
        });
        // 文本总宽度
        const totalWidth = textWidth + ((textArrayLen - 1) * spacing);
        // 计算x坐标偏移量
        let wOffset = 0;
        let ii = textArrayLen - 1;
        while (ii >= 0) {
          const item = textArray[ii];
          item.tx = wOffset;
          wOffset += spacing;
          ii -= 1;
        }
        // 文本坐标
        let bx = rect.x;
        let by = rect.y;
        let pw = 0;
        let ph = 0;
        switch (align) {
          case BaseFont.ALIGN.center:
            bx += width / 2 - totalWidth / 2;
            pw = 0;
            break;
          case BaseFont.ALIGN.left:
            bx += padding;
            pw = padding;
            break;
          case BaseFont.ALIGN.right:
            bx += width - totalWidth - padding;
            pw = padding;
            break;
        }
        switch (verticalAlign) {
          case BaseFont.VERTICAL_ALIGN.center:
            by += height / 2 - textHeight / 2;
            ph = 0;
            break;
          case BaseFont.VERTICAL_ALIGN.top:
            by += padding;
            ph = padding;
            break;
          case BaseFont.VERTICAL_ALIGN.bottom:
            by += height - textHeight - padding;
            ph = padding;
            break;
        }
        // 边界检查
        const outbounds = totalWidth + pw > overflow.width
          || textHeight + ph > overflow.height;
        if (outbounds) {
          // 裁剪宽度
          const crop = new Crop({
            draw: dw,
            rect: overflow,
          });
          crop.open();
          // 渲染文本
          let jj = 0;
          while (jj < textArrayLen) {
            // 计算文本的绘制位置旋转中心
            const item = textArray[jj];
            const rx = item.tx + bx;
            const ry = item.ty + by;
            let ax = 0;
            let ay = 0;
            switch (align) {
              case BaseFont.ALIGN.center: {
                ax = rx + textWidth / 2;
                ay = ry + textHeight / 2;
                break;
              }
              case BaseFont.ALIGN.left: {
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
              case BaseFont.ALIGN.right: {
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
            }
            const tx = ax - item.len / 2;
            const ty = ay - size / 2;
            // 旋转并且绘制文本
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
            jj += 1;
          }
          crop.close();
        } else {
          // 渲染文本
          let jj = 0;
          while (jj < textArrayLen) {
            // 计算文本的绘制位置旋转中心
            const item = textArray[jj];
            const rx = item.tx + bx;
            const ry = item.ty + by;
            let ax = 0;
            let ay = 0;
            switch (align) {
              case BaseFont.ALIGN.center: {
                ax = rx + textWidth / 2;
                ay = ry + textHeight / 2;
                break;
              }
              case BaseFont.ALIGN.left: {
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
              case BaseFont.ALIGN.right: {
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
            }
            const tx = ax - item.len / 2;
            const ty = ay - size / 2;
            // 旋转并且绘制文本
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
            jj += 1;
          }
        }
        // 计算文本占据的宽度(padding)
        let haveWidth = 0;
        switch (align) {
          case BaseFont.ALIGN.center:
            haveWidth = totalWidth;
            break;
          case BaseFont.ALIGN.right:
          case BaseFont.ALIGN.left:
            haveWidth = totalWidth + padding;
            break;
        }
        return haveWidth;
      }
      // 计算文本块大小
      const textWidth = this.textWidth(text);
      const trigonometricWidth = Math.max(RTCosKit.nearby({
        tilt: textWidth,
        angle,
      }), size);
      const trigonometricHeight = RTSinKit.inverse({
        tilt: textWidth,
        angle,
      });
      // 计算文本绘制位置旋转中心
      let rtx = rect.x;
      let rty = rect.y;
      let pw = 0;
      let ph = 0;
      switch (align) {
        case BaseFont.ALIGN.center:
          rtx += width / 2 - trigonometricWidth / 2;
          pw = 0;
          break;
        case BaseFont.ALIGN.left:
          rtx += padding;
          pw = padding;
          break;
        case BaseFont.ALIGN.right:
          rtx += width - trigonometricWidth - padding;
          pw = padding;
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.center:
          rty += height / 2 - trigonometricHeight / 2;
          ph = 0;
          break;
        case BaseFont.VERTICAL_ALIGN.top:
          rty += padding;
          ph = padding;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          rty += height - trigonometricHeight - padding;
          ph = padding;
          break;
      }
      // 边界检查
      const outbounds = trigonometricWidth + pw > overflow.width
        || trigonometricHeight + ph > overflow.height;
      if (outbounds) {
        // 裁剪宽度
        const crop = new Crop({
          draw: dw,
          rect: overflow,
        });
        crop.open();
        // 旋转并且绘制文本
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
        crop.close();
      } else {
        // 旋转并且绘制文本
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
      }
      // 计算文本占据的宽度(padding)
      let haveWidth;
      switch (align) {
        case BaseFont.ALIGN.center:
          haveWidth = trigonometricWidth;
          break;
        case BaseFont.ALIGN.right:
        case BaseFont.ALIGN.left:
          haveWidth = trigonometricWidth + padding * 2;
          break;
      }
      return haveWidth;
    }
    if (angle === 0) {
      // 计算文本折行
      const breakArray = this.textBreak(text);
      const textArray = [];
      const { width, height } = rect;
      const breakLen = breakArray.length;
      let bi = 0;
      let hOffset = 0;
      let maxLen = 0;
      while (bi < breakLen) {
        if (bi > 0) {
          hOffset += size + lineHeight;
        }
        const text = breakArray[bi];
        const item = {
          tx: 0,
          ty: hOffset,
          text,
          len: this.textWidth(text),
        };
        textArray.push(item);
        if (item.len > maxLen) {
          maxLen = item.len;
        }
        bi += 1;
      }
      if (hOffset > 0) {
        hOffset -= lineHeight;
      }
      // 计算文本坐标
      let bx = rect.x;
      let by = rect.y;
      let pw = 0;
      let ph = 0;
      switch (align) {
        case BaseFont.ALIGN.center:
          bx += width / 2;
          pw = 0;
          break;
        case BaseFont.ALIGN.left:
          bx += padding;
          pw = padding;
          break;
        case BaseFont.ALIGN.right:
          bx += width - padding;
          pw = padding;
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.center:
          by += height / 2 - hOffset / 2;
          ph = 0;
          break;
        case BaseFont.VERTICAL_ALIGN.top:
          by += padding;
          ph = padding;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          by += height - hOffset - padding;
          ph = padding;
          break;
      }
      // 边界检查
      const totalHeight = (textArray.length * (size + lineHeight)) - lineHeight;
      const outbounds = maxLen + pw > overflow.width || totalHeight + ph > overflow.height;
      let pointOffset = false;
      if (align === BaseFont.ALIGN.center) {
        const diff = maxLen / 2 - width / 2;
        if (diff > 0) {
          if (overflow.x > rect.x - diff) {
            pointOffset = true;
          }
        }
      }
      if (outbounds || pointOffset) {
        // 裁剪宽度
        const crop = new Crop({
          draw: dw,
          rect: overflow,
        });
        crop.open();
        // 文本绘制
        const textLen = textArray.length;
        let ti = 0;
        while (ti < textLen) {
          const item = textArray[ti];
          item.tx += bx;
          item.ty += by;
          dw.fillText(item.text, item.tx, item.ty);
          if (underline) {
            this.drawLine('underline', item.tx, item.ty, item.len);
          }
          if (strikethrough) {
            this.drawLine('strike', item.tx, item.ty, item.len);
          }
          ti += 1;
        }
        crop.close();
      } else {
        // 文本绘制
        const textLen = textArray.length;
        let ti = 0;
        while (ti < textLen) {
          const item = textArray[ti];
          item.tx += bx;
          item.ty += by;
          dw.fillText(item.text, item.tx, item.ty);
          if (underline) {
            this.drawLine('underline', item.tx, item.ty, item.len);
          }
          if (strikethrough) {
            this.drawLine('strike', item.tx, item.ty, item.len);
          }
          ti += 1;
        }
      }
      // 计算文本占据的宽度(padding)
      let haveWidth = 0;
      switch (align) {
        case BaseFont.ALIGN.right:
        case BaseFont.ALIGN.left:
          haveWidth = padding + maxLen;
          break;
        case BaseFont.ALIGN.center:
          haveWidth = maxLen;
          break;
      }
      return haveWidth;
    }
    return 0;
  }

  wrapTextFont() {
    const {
      text, dw, attr, rect,
    } = this;
    let { overflow } = this;
    if (!overflow) {
      overflow = rect;
    }
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
      const textHypotenuseWidth = RTSinKit.tilt({
        inverse: height - (padding * 2),
        angle,
      });
      // 折行文本计算
      const breakArray = this.textBreak(text);
      const textArray = [];
      const breakLen = breakArray.length;
      let bi = 0;
      let maxLen = 0;
      while (bi < breakLen) {
        const text = breakArray[bi];
        const textLen = text.length;
        const line = {
          str: '',
          len: 0,
          start: 0,
        };
        let ii = 0;
        while (ii < textLen) {
          const str = line.str + text.charAt(ii);
          const len = this.textWidth(str);
          if (len > textHypotenuseWidth) {
            if (line.len === 0) {
              textArray.push({
                text: str,
                len,
                tx: 0,
                ty: 0,
              });
              if (len > maxLen) {
                maxLen = len;
              }
              ii += 1;
            } else {
              textArray.push({
                text: line.str,
                len: line.len,
                tx: 0,
                ty: 0,
              });
              if (line.len > maxLen) {
                maxLen = line.len;
              }
            }
            line.str = '';
            line.len = 0;
            line.start = ii;
          } else {
            line.str = str;
            line.len = len;
            ii += 1;
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
        if (line.len > maxLen) {
          maxLen = line.len;
        }
        bi += 1;
      }
      const textArrayLen = textArray.length;
      // 多行文本
      if (textArrayLen > 1) {
        // 文本间隙
        const spacing = RTSinKit.tilt({
          inverse: size + lineHeight,
          angle,
        });
        // 文本宽高
        const textWidth = Math.max(RTCosKit.nearby({
          tilt: maxLen,
          angle,
        }), size);
        const textHeight = RTSinKit.inverse({
          tilt: maxLen,
          angle,
        });
        // 总宽度
        const totalWidth = textWidth + ((textArrayLen - 1) * spacing);
        // x坐标偏移量
        let wOffset = 0;
        let ii = 0;
        while (ii < textArrayLen) {
          const item = textArray[ii];
          item.tx = wOffset;
          wOffset += spacing;
          ii += 1;
        }
        // 文本坐标
        let bx = rect.x;
        let by = rect.y;
        let pw = 0;
        let ph = 0;
        switch (align) {
          case BaseFont.ALIGN.center:
            bx += width / 2 - totalWidth / 2;
            pw = 0;
            break;
          case BaseFont.ALIGN.left:
            bx += padding;
            pw = padding;
            break;
          case BaseFont.ALIGN.right:
            bx += width - totalWidth - padding;
            pw = padding;
            break;
        }
        switch (verticalAlign) {
          case BaseFont.VERTICAL_ALIGN.center:
            by += height / 2 - textHeight / 2;
            ph = 0;
            break;
          case BaseFont.VERTICAL_ALIGN.top:
            by += padding;
            ph = padding;
            break;
          case BaseFont.VERTICAL_ALIGN.bottom:
            by += height - textHeight - padding;
            ph = padding;
            break;
        }
        // 边界检查
        const outbounds = totalWidth + pw > overflow.width
          || textHeight + ph > overflow.height;
        if (outbounds) {
          // 裁剪宽度
          const crop = new Crop({
            draw: dw,
            rect: overflow,
          });
          crop.open();
          // 渲染文本
          let jj = 0;
          while (jj < textArrayLen) {
            // 计算文本的 绘制位置 旋转中心
            const item = textArray[jj];
            const rx = item.tx + bx;
            const ry = item.ty + by;
            let ax = 0;
            let ay = 0;
            switch (align) {
              case BaseFont.ALIGN.center: {
                ax = rx + textWidth / 2;
                ay = ry + textHeight / 2;
                break;
              }
              case BaseFont.ALIGN.left: {
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
              case BaseFont.ALIGN.right: {
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
            }
            const tx = ax - item.len / 2;
            const ty = ay - size / 2;
            // 旋转并且 绘制文本
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
            jj += 1;
          }
          crop.close();
        } else {
          // 渲染文本
          let jj = 0;
          while (jj < textArrayLen) {
            // 计算文本的 绘制位置 旋转中心
            const item = textArray[jj];
            const rx = item.tx + bx;
            const ry = item.ty + by;
            let ax = 0;
            let ay = 0;
            switch (align) {
              case BaseFont.ALIGN.center: {
                ax = rx + textWidth / 2;
                ay = ry + textHeight / 2;
                break;
              }
              case BaseFont.ALIGN.left: {
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
              case BaseFont.ALIGN.right: {
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
            }
            const tx = ax - item.len / 2;
            const ty = ay - size / 2;
            // 旋转并且 绘制文本
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
            jj += 1;
          }
        }
        // 文本占据的宽度(padding)
        let haveWidth;
        switch (align) {
          case BaseFont.ALIGN.center:
            haveWidth = totalWidth;
            break;
          case BaseFont.ALIGN.right:
          case BaseFont.ALIGN.left:
            haveWidth = totalWidth + padding;
            break;
        }
        return haveWidth;
      }
      // 文本大小
      const textWidth = this.textWidth(text);
      const trigonometricWidth = Math.max(RTCosKit.nearby({
        tilt: textWidth,
        angle,
      }), size);
      const trigonometricHeight = RTSinKit.inverse({
        tilt: textWidth,
        angle,
      });
      // 文本坐标
      let rtx = rect.x;
      let rty = rect.y;
      let pw = 0;
      let ph = 0;
      switch (align) {
        case BaseFont.ALIGN.center:
          rtx += width / 2 - trigonometricWidth / 2;
          pw = 0;
          break;
        case BaseFont.ALIGN.left:
          rtx += padding;
          pw = padding;
          break;
        case BaseFont.ALIGN.right:
          rtx += width - trigonometricWidth - padding;
          pw = padding;
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.center:
          rty += height / 2 - trigonometricHeight / 2;
          ph = 0;
          break;
        case BaseFont.VERTICAL_ALIGN.top:
          rty += padding;
          ph = padding;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          rty += height - trigonometricHeight - padding;
          ph = padding;
          break;
      }
      // 边界检查
      const outbounds = trigonometricWidth + pw > overflow.width
        || trigonometricHeight + ph > overflow.height;
      if (outbounds) {
        // 裁剪宽度
        const crop = new Crop({
          draw: dw,
          rect: overflow,
        });
        crop.open();
        // 旋转并且绘制文本
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
        crop.close();
      } else {
        // 旋转并且绘制文本
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
      }
      // 计算文本占据的宽度(padding)
      let haveWidth = 0;
      switch (align) {
        case BaseFont.ALIGN.center:
          haveWidth = trigonometricWidth;
          break;
        case BaseFont.ALIGN.right:
        case BaseFont.ALIGN.left:
          haveWidth = trigonometricWidth + padding;
          break;
      }
      return haveWidth;
    }
    if (angle < 0) {
      const textHypotenuseWidth = RTSinKit.tilt({
        inverse: height - (padding * 2),
        angle,
      });
      // 折行文本计算
      const breakArray = this.textBreak(text);
      const textArray = [];
      const breakLen = breakArray.length;
      let bi = 0;
      let maxLen = 0;
      while (bi < breakLen) {
        const text = breakArray[bi];
        const textLen = text.length;
        const line = {
          str: '',
          len: 0,
          start: 0,
        };
        let ii = 0;
        while (ii < textLen) {
          const str = line.str + text.charAt(ii);
          const len = this.textWidth(str);
          if (len > textHypotenuseWidth) {
            if (line.len === 0) {
              textArray.push({
                text: str,
                len,
                tx: 0,
                ty: 0,
              });
              if (len > maxLen) {
                maxLen = len;
              }
              ii += 1;
            } else {
              textArray.push({
                text: line.str,
                len: line.len,
                tx: 0,
                ty: 0,
              });
              if (line.len > maxLen) {
                maxLen = line.len;
              }
            }
            line.str = '';
            line.len = 0;
            line.start = ii;
          } else {
            line.str = str;
            line.len = len;
            ii += 1;
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
        if (line.len > maxLen) {
          maxLen = line.len;
        }
        bi += 1;
      }
      const textArrayLen = textArray.length;
      // 多行文本
      if (textArrayLen > 1) {
        // 计算文本块之间的间隙
        const spacing = RTSinKit.tilt({
          inverse: size + lineHeight,
          angle,
        });
        // 计算每个文本块宽度和高度
        const textWidth = Math.max(RTCosKit.nearby({
          tilt: maxLen,
          angle,
        }), size);
        const textHeight = RTSinKit.inverse({
          tilt: maxLen,
          angle,
        });
        // 文本总宽度
        const totalWidth = textWidth + ((textArrayLen - 1) * spacing);
        // 计算x坐标偏移量
        let wOffset = 0;
        let ii = textArrayLen - 1;
        while (ii >= 0) {
          const item = textArray[ii];
          item.tx = wOffset;
          wOffset += spacing;
          ii -= 1;
        }
        // 文本坐标
        let bx = rect.x;
        let by = rect.y;
        let pw = 0;
        let ph = 0;
        switch (align) {
          case BaseFont.ALIGN.center:
            bx += width / 2 - totalWidth / 2;
            pw = 0;
            break;
          case BaseFont.ALIGN.left:
            bx += padding;
            pw = padding;
            break;
          case BaseFont.ALIGN.right:
            bx += width - totalWidth - padding;
            pw = padding;
            break;
        }
        switch (verticalAlign) {
          case BaseFont.VERTICAL_ALIGN.center:
            by += height / 2 - textHeight / 2;
            ph = 0;
            break;
          case BaseFont.VERTICAL_ALIGN.top:
            by += padding;
            ph = padding;
            break;
          case BaseFont.VERTICAL_ALIGN.bottom:
            by += height - textHeight - padding;
            ph = padding;
            break;
        }
        // 边界检查
        const outbounds = totalWidth + pw > overflow.width
          || textHeight + ph > overflow.height;
        if (outbounds) {
          // 裁剪宽度
          const crop = new Crop({
            draw: dw,
            rect: overflow,
          });
          crop.open();
          // 渲染文本
          let jj = 0;
          while (jj < textArrayLen) {
            // 计算文本的绘制位置旋转中心
            const item = textArray[jj];
            const rx = item.tx + bx;
            const ry = item.ty + by;
            let ax = 0;
            let ay = 0;
            switch (align) {
              case BaseFont.ALIGN.center: {
                ax = rx + textWidth / 2;
                ay = ry + textHeight / 2;
                break;
              }
              case BaseFont.ALIGN.left: {
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
              case BaseFont.ALIGN.right: {
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
            }
            const tx = ax - item.len / 2;
            const ty = ay - size / 2;
            // 旋转并且绘制文本
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
            jj += 1;
          }
          crop.close();
        } else {
          // 渲染文本
          let jj = 0;
          while (jj < textArrayLen) {
            // 计算文本的绘制位置旋转中心
            const item = textArray[jj];
            const rx = item.tx + bx;
            const ry = item.ty + by;
            let ax = 0;
            let ay = 0;
            switch (align) {
              case BaseFont.ALIGN.center: {
                ax = rx + textWidth / 2;
                ay = ry + textHeight / 2;
                break;
              }
              case BaseFont.ALIGN.left: {
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
              case BaseFont.ALIGN.right: {
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
            }
            const tx = ax - item.len / 2;
            const ty = ay - size / 2;
            // 旋转并且绘制文本
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
            jj += 1;
          }
        }
        // 计算文本占据的宽度(padding)
        let haveWidth = 0;
        switch (align) {
          case BaseFont.ALIGN.center:
            haveWidth = totalWidth;
            break;
          case BaseFont.ALIGN.right:
          case BaseFont.ALIGN.left:
            haveWidth = totalWidth + padding;
            break;
        }
        return haveWidth;
      }
      // 计算文本块大小
      const textWidth = this.textWidth(text);
      const trigonometricWidth = Math.max(RTCosKit.nearby({
        tilt: textWidth,
        angle,
      }), size);
      const trigonometricHeight = RTSinKit.inverse({
        tilt: textWidth,
        angle,
      });
      // 计算文本绘制位置旋转中心
      let rtx = rect.x;
      let rty = rect.y;
      let pw = 0;
      let ph = 0;
      switch (align) {
        case BaseFont.ALIGN.center:
          rtx += width / 2 - trigonometricWidth / 2;
          pw = 0;
          break;
        case BaseFont.ALIGN.left:
          rtx += padding;
          pw = padding;
          break;
        case BaseFont.ALIGN.right:
          rtx += width - trigonometricWidth - padding;
          pw = padding;
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.center:
          rty += height / 2 - trigonometricHeight / 2;
          ph = 0;
          break;
        case BaseFont.VERTICAL_ALIGN.top:
          rty += padding;
          ph = padding;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          rty += height - trigonometricHeight - padding;
          ph = padding;
          break;
      }
      // 边界检查
      const outbounds = trigonometricWidth + pw > overflow.width
        || trigonometricHeight + ph > overflow.height;
      if (outbounds) {
        // 裁剪宽度
        const crop = new Crop({
          draw: dw,
          rect: overflow,
        });
        crop.open();
        // 旋转并且绘制文本
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
        crop.close();
      } else {
        // 旋转并且绘制文本
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
      }
      // 计算文本占据的宽度(padding)
      let haveWidth;
      switch (align) {
        case BaseFont.ALIGN.center:
          haveWidth = trigonometricWidth;
          break;
        case BaseFont.ALIGN.right:
        case BaseFont.ALIGN.left:
          haveWidth = trigonometricWidth + padding * 2;
          break;
      }
      return haveWidth;
    }
    if (angle === 0) {
      // 计算文本折行
      const breakArray = this.textBreak(text);
      const textArray = [];
      const { width, height } = rect;
      const maxWidth = width - (padding * 2);
      const breakLen = breakArray.length;
      let bi = 0;
      let hOffset = 0;
      while (bi < breakLen) {
        if (bi > 0) {
          hOffset += size + lineHeight;
        }
        const text = breakArray[bi];
        const textLen = text.length;
        let ii = 0;
        const line = {
          str: '',
          len: 0,
          start: 0,
        };
        while (ii < textLen) {
          const str = line.str + text.charAt(ii);
          const len = this.textWidth(str);
          if (len > maxWidth) {
            if (line.len === 0) {
              textArray.push({
                text: str,
                len,
                tx: 0,
                ty: hOffset,
              });
              ii += 1;
            } else {
              textArray.push({
                text: line.str,
                len: line.len,
                tx: 0,
                ty: hOffset,
              });
            }
            hOffset += size + lineHeight;
            line.str = '';
            line.len = 0;
            line.start = ii;
          } else {
            line.str = str;
            line.len = len;
            ii += 1;
          }
        }
        if (line.len > 0) {
          textArray.push({
            text: text.substring(line.start),
            len: line.len,
            tx: 0,
            ty: hOffset,
          });
        }
        bi += 1;
      }
      if (hOffset > 0) {
        hOffset -= lineHeight;
      }
      // 计算文本坐标
      let bx = rect.x;
      let by = rect.y;
      let ph = 0;
      switch (align) {
        case BaseFont.ALIGN.left:
          bx += padding;
          break;
        case BaseFont.ALIGN.center:
          bx += width / 2;
          break;
        case BaseFont.ALIGN.right:
          bx += width - padding;
          break;
        default:
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.center:
          by += height / 2 - hOffset / 2;
          ph = 0;
          break;
        case BaseFont.VERTICAL_ALIGN.top:
          by += padding;
          ph = padding;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          by += height - hOffset - padding;
          ph = padding;
          break;
      }
      // 边界检查
      const totalHeight = (textArray.length * (size + lineHeight)) - lineHeight;
      const outbounds = totalHeight + ph > height;
      if (outbounds) {
        // 裁剪宽度
        const crop = new Crop({
          draw: dw,
          rect,
        });
        crop.open();
        const textLen = textArray.length;
        let ti = 0;
        while (ti < textLen) {
          const item = textArray[ti];
          item.tx += bx;
          item.ty += by;
          dw.fillText(item.text, item.tx, item.ty);
          if (underline) {
            this.drawLine('underline', item.tx, item.ty, item.len);
          }
          if (strikethrough) {
            this.drawLine('strike', item.tx, item.ty, item.len);
          }
          ti += 1;
        }
        crop.close();
      } else {
        for (let i = 0, len = textArray.length; i < len; i += 1) {
          const item = textArray[i];
          item.tx += bx;
          item.ty += by;
          dw.fillText(item.text, item.tx, item.ty);
          if (underline) {
            this.drawLine('underline', item.tx, item.ty, item.len);
          }
          if (strikethrough) {
            this.drawLine('strike', item.tx, item.ty, item.len);
          }
        }
      }
      return 0;
    }
    return 0;
  }

}

export {
  AngleFont,
};
