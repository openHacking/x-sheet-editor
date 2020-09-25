import { RectRange } from '../../table/tablebase/RectRange';

class CopyFormatHelper {

  /**
   * 循环区域
   * @param originView
   * @param targetView
   * @param callback
   */
  static each({
    originView,
    targetView,
    callback = () => {},
  }) {
    const {
      sri: tSri, sci: tSci,
    } = targetView;
    const {
      sri: oSri, sci: oSci, eri: oEri, eci: oEci,
    } = originView;
    for (let oi = oSri, ti = tSri; oi <= oEri; oi += 1, ti += 1) {
      for (let oj = oSci, tj = tSci; oj <= oEci; oj += 1, tj += 1) {
        callback(ti, tj, oi, oj);
      }
    }
  }

  /**
   * 复制样式
   * @param originView
   * @param targetView
   * @param mergeCheck
   * @param masterCheck
   * @param cellOrMaster
   * @param mergeExecute
   * @param copyExecute
   * @param mergeRemove
   */
  static copy({
    originView,
    targetView,
    mergeCheck = () => {},
    masterCheck = () => {},
    cellOrMaster = () => {},
    mergeExecute = () => {},
    copyExecute = () => {},
    mergeRemove = () => {},
  }) {
    this.each({
      originView,
      targetView,
      callback: (tri, tci, ori, oci) => {
        // 原始单元格是否是主单元格
        if (masterCheck(ori, oci)) {
          // 处理普通单元格
          const origin = cellOrMaster(ori, oci);
          const target = cellOrMaster(tri, tci);
          copyExecute(origin, target, tri, tci);
          // 处理合并单元格
          const om = mergeCheck(ori, oci);
          const tm = mergeCheck(tri, tci);
          if (tm) {
            mergeRemove(tm);
          }
          if (om) {
            const [rn, cn] = om.size();
            mergeExecute(new RectRange(tri, tci, tri + (rn - 1), tci + (cn - 1)));
          }
        }
      },
    });
  }

}

export {
  CopyFormatHelper,
};