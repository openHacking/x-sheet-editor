import {AngleBoxRuler} from './AngleBoxRuler';
import {BaseFont} from '../BaseFont';
import {RTCosKit, RTSinKit} from "../../RTFunction";
import {BaseRuler} from "../BaseRuler";
import {PlainUtils} from "../../../utils/PlainUtils";

class AngleBarRuler extends AngleBoxRuler {

    constructor({
        draw, text, size, angle, rect, overflow, align, verticalAlign, textWrap, lineHeight = 8, padding,
    }) {
        super({
            draw, text, size, angle, rect, overflow, align, verticalAlign, textWrap, lineHeight, padding
        });
        this.textWrapCenterX = 0;
    }

    equals(other) {
        if (other === null) {
            return false;
        }
        if (other.constructor !== AngleBarRuler) {
            return false;
        }
        if (other.text !== this.text) {
            return false;
        }
        if (other.size !== this.size) {
            return false;
        }
        if (other.angle !== this.angle) {
            return false;
        }
        if (other.align !== this.align) {
            return false;
        }
        if (other.verticalAlign !== this.verticalAlign) {
            return false;
        }
        if (other.textWrap !== this.textWrap) {
            return false;
        }
        if (other.padding !== this.padding) {
            return false;
        }
        const diffWidth = other.overflow.width !== this.overflow.width;
        const diffHeight = other.overflow.height !== this.overflow.height;
        if (diffWidth || diffHeight) {
            return false;
        }
        switch (this.textWrap) {
            case BaseFont.TEXT_WRAP.WORD_WRAP: {
                if (other.lineHeight !== this.lineHeight) {
                    return false;
                }
                break;
            }
        }
        return true;
    }

    textWrapRuler() {
        if (this.used) {
            return;
        }
        super.textWrapRuler();
        const {textWrapTextArray, textWrapTextWidth} = this;
        const head = PlainUtils.arrayHead(textWrapTextArray);
        const last = PlainUtils.arrayLast(textWrapTextArray);
        if (head !== last) {
            const headCenter = head.tx + head.blockWidth / 2;
            const lastCenter = last.tx + last.blockWidth / 2;
            const textCenter = lastCenter - headCenter;
            this.textWrapCenterX = headCenter + textCenter / 2;
        } else {
            this.textWrapCenterX = textWrapTextWidth / 2;
        }
    }

}

export {
    AngleBarRuler,
};
