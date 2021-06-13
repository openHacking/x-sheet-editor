import { BaseFont } from '../../BaseFont';
import {RichAngleBoxDraw} from "../draw/RichAngleBoxDraw";
import {RichAngleBarDraw} from "../draw/RichAngleBarDraw";
import {RichHorizonDraw} from "../draw/RichHorizonDraw";
import {RichVerticalDraw} from "../draw/RichVerticalDraw";
import {RichHorizonRuler} from "../ruler/RichHorizonRuler";
import {RichVerticalRuler} from "../ruler/RichVerticalRuler";
import {RichAngleBoxRuler} from "../ruler/RichAngleBoxRuler";
import {RichAngleBarRuler} from "../ruler/RichAngleBarRuler";

class RichDrawTextBuilder {

  constructor({
    draw, rich, rect, overflow, attr
  }) {
    this.attr = Object.assign({}, BaseFont.DEFAULT_RICH_ATTR, attr);
    this.rich = rich;
    this.rect = rect;
    this.draw = draw;
    this.overflow = overflow;
  }

  buildFont() {
    const { rich, attr, draw, rect , overflow } = this;
    switch (attr.direction) {
      case BaseFont.TEXT_DIRECTION.HORIZONTAL:
        return new RichHorizonDraw({
          draw, rich, rect, overflow, attr,
        });
      case BaseFont.TEXT_DIRECTION.VERTICAL:
        return new RichVerticalDraw({
          draw, rich, rect, overflow, attr,
        });
      case BaseFont.TEXT_DIRECTION.ANGLE:
        return new RichAngleBoxDraw({
          draw, rich, rect, overflow, attr,
        });
      case BaseFont.TEXT_DIRECTION.ANGLE_BAR:
        return new RichAngleBarDraw({
          draw, rich, rect, overflow, attr,
        });
    }
    return null;
  }

  buildRuler() {
    const { rich, attr, draw, rect, overflow } = this;
    const { name, size, bold, italic, angle } = attr;
    const { padding, textWrap } = attr;
    switch (attr.direction) {
      case BaseFont.TEXT_DIRECTION.HORIZONTAL:
        return new RichHorizonRuler({
          draw, rich, rect, overflow,
          name, size, bold, italic, padding, textWrap,
        });
      case BaseFont.TEXT_DIRECTION.VERTICAL:
        return new RichVerticalRuler({
          draw, rich, size, rect, overflow, textWrap, padding
        });
      case BaseFont.TEXT_DIRECTION.ANGLE:
        return new RichAngleBoxRuler({
          draw, rich, size, angle, rect, overflow, textWrap, padding
        });
      case BaseFont.TEXT_DIRECTION.ANGLE_BAR:
        return new RichAngleBarRuler({
          draw, rich, size, angle, rect, overflow, textWrap, padding
        });
    }
    return null;
  }

}
