import { RowsIterator } from '../iterator/RowsIterator';
import { ColsIterator } from '../iterator/ColsIterator';
import { BaseCellsHelper } from './BaseCellsHelper';
import { RectRange } from '../tablebase/RectRange';

class CopyMerge {

  constructor({
    targetViewRange,
    originViewRange,
    merge = () => {},
    master = () => {},
    onCopy = () => {},
  }) {
    this.targetViewRange = targetViewRange;
    this.originViewRange = originViewRange;
    this.master = master;
    this.merge = merge;
    this.onCopy = onCopy;
  }

  copyStartRow() {
    const { originViewRange } = this;
    return originViewRange.sri;
  }

  copyEndRow() {
    const { originViewRange } = this;
    return originViewRange.eri;
  }

  nextCopyRow(row) {
    const endRow = this.copyEndRow();
    if (row >= endRow) {
      return this.copyStartRow();
    }
    return row + 1;
  }

  copyStartCol() {
    const { originViewRange } = this;
    return originViewRange.sci;
  }

  copyEndCol() {
    const { originViewRange } = this;
    return originViewRange.eci;
  }

  nextCopyCol(col) {
    const endCol = this.copyEndCol();
    if (col >= endCol) {
      return this.copyStartCol();
    }
    return col + 1;
  }

  pasteStartRow() {
    const { targetViewRange } = this;
    return targetViewRange.sri;
  }

  pasteEndRow() {
    const { targetViewRange } = this;
    return targetViewRange.eri;
  }

  pasteStartCol() {
    const { targetViewRange } = this;
    return targetViewRange.sci;
  }

  pasteEndCol() {
    const { targetViewRange } = this;
    return targetViewRange.eci;
  }

  executeCopy() {
    let ori = this.copyStartRow();
    RowsIterator.getInstance()
      .setBegin(this.pasteStartRow())
      .setEnd(this.pasteEndRow())
      .setLoop((tri) => {
        let oci = this.copyStartCol();
        ColsIterator.getInstance()
          .setBegin(this.pasteStartCol())
          .setEnd(this.pasteEndCol())
          .setLoop((tci) => {
            const merge = this.merge(ori, oci);
            if (merge && this.master(ori, oci, merge)) {
              this.onCopy(tri, tci, merge);
            }
          })
          .setNext(() => {
            oci = this.nextCopyCol(oci);
          })
          .execute();
      })
      .setNext(() => {
        ori = this.nextCopyRow(ori);
      })
      .foldOnOff(false)
      .execute();
  }

}

class CopyCellIN {

  constructor({
    targetViewRange,
    originViewRange,
    onCopy = () => {},
  }) {
    this.targetViewRange = targetViewRange;
    this.originViewRange = originViewRange;
    this.onCopy = onCopy;
  }

  copyStartRow() {
    const { originViewRange } = this;
    const { sri, eri } = originViewRange;
    return RowsIterator.getInstance()
      .setBegin(sri - 1)
      .setEnd(eri)
      .nextRow();
  }

  copyEndRow() {
    const { originViewRange } = this;
    const { sri, eri } = originViewRange;
    return RowsIterator.getInstance()
      .setBegin(eri + 1)
      .setEnd(sri)
      .nextRow();
  }

  nextCopyRow(row) {
    const endRow = this.copyEndRow();
    if (row >= endRow) {
      return this.copyStartRow();
    }
    return RowsIterator.getInstance()
      .setBegin(row)
      .setEnd(endRow)
      .nextRow();
  }

  copyStartCol() {
    const { originViewRange } = this;
    return originViewRange.sci;
  }

  copyEndCol() {
    const { originViewRange } = this;
    return originViewRange.eci;
  }

  nextCopyCol(col) {
    const endCol = this.copyEndCol();
    if (col >= endCol) {
      return this.copyStartCol();
    }
    return col + 1;
  }

  pasteStartRow() {
    const { targetViewRange } = this;
    return targetViewRange.sri;
  }

  pasteEndRow() {
    const { targetViewRange } = this;
    return targetViewRange.eri;
  }

  pasteStartCol() {
    const { targetViewRange } = this;
    return targetViewRange.sci;
  }

  pasteEndCol() {
    const { targetViewRange } = this;
    return targetViewRange.eci;
  }

  executeCopy() {
    let ori = this.copyStartRow();
    RowsIterator.getInstance()
      .setBegin(this.pasteStartRow())
      .setEnd(this.pasteEndRow())
      .setLoop((tri) => {
        let oci = this.copyStartCol();
        ColsIterator.getInstance()
          .setBegin(this.pasteStartCol())
          .setEnd(this.pasteEndCol())
          .setLoop((tci) => {
            this.onCopy(tri, tci, ori, oci);
          })
          .setNext(() => {
            oci = this.nextCopyCol(oci);
          })
          .execute();
      })
      .setNext(() => {
        ori = this.nextCopyRow(ori);
      })
      .execute();
  }

}

class CellMergeCopyHelper extends BaseCellsHelper {

  copyCellINContent({
    originViewRange, targetViewRange,
  }) {
    const {
      cells, tableDataSnapshot,
    } = this;
    const { cellDataProxy } = tableDataSnapshot;
    const copy = new CopyCellIN({
      originViewRange,
      targetViewRange,
      onCopy: (tri, tci, ori, oci) => {
        const src = cells.getCell(ori, oci);
        if (src) {
          const target = src.clone();
          cellDataProxy.setCell(tri, tci, target);
        }
      },
    });
    copy.executeCopy();
  }

  copyMergeContent({
    originViewRange, targetViewRange,
  }) {
    const {
      merges, tableDataSnapshot,
    } = this;
    const { mergeDataProxy } = tableDataSnapshot;
    const copy = new CopyMerge({
      originViewRange,
      targetViewRange,
      merge: (ri, ci) => merges.getFirstIncludes(ri, ci),
      master: (ri, ci, m) => m.sri === ri && m.sci === ci,
      onCopy: (ri, ci, m) => {
        let [rSize, cSize] = m.size();
        cSize -= 1;
        rSize -= 1;
        const newMerge = new RectRange(ri, ci, ri + rSize, ci + cSize);
        const hasFold = RowsIterator.getInstance()
          .setBegin(newMerge.sri)
          .setEnd(newMerge.eri)
          .hasFold();
        if (hasFold) {
          return;
        }
        newMerge.each((ri, ci) => {
          const merge = merges.getFirstIncludes(ri, ci);
          if (merge) {
            mergeDataProxy.deleteMerge(merge);
          }
        });
        mergeDataProxy.addMerge(newMerge);
      },
    });
    copy.executeCopy();
  }

  copyStylesContent({
    originViewRange, targetViewRange,
  }) {
    const {
      cells, tableDataSnapshot,
    } = this;
    const { cellDataProxy } = tableDataSnapshot;
    const copy = new CopyCellIN({
      originViewRange,
      targetViewRange,
      onCopy: (tri, tci, ori, oci) => {
        const src = cells.getCell(ori, oci);
        if (src) {
          const target = cells.getCellOrNew(tri, tci);
          const clone = src.clone();
          clone.text = target.text;
          cellDataProxy.setCell(tri, tci, clone);
        }
      },
    });
    copy.executeCopy();
  }

}

export {
  CellMergeCopyHelper,
};
