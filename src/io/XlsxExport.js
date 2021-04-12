import ExcelJS from 'exceljs/dist/exceljs';
import {XDraw} from "../canvas/XDraw";
import Download from '../libs/donwload/Download';
import {BaseFont} from "../canvas/font/BaseFont";

class XlsxExport {

    static next(i, step = 1) {
        return i + step;
    }

    static last(i, step = 1) {
        return i - step;
    }

    static export(work) {
        const {sheetView} = work.body;
        const {sheetList} = sheetView;
        // 创建工作薄
        const workbook = new ExcelJS.Workbook();
        workbook.lastModifiedBy = work.options.lastModifiedBy;
        workbook.creator = work.options.creator;
        workbook.created = work.options.created;
        workbook.modified = work.options.modified;
        // 添加工作表
        sheetList.forEach((sheet) => {
            const {tab, table} = sheet;
            const {settings, rows, cols} = table;
            const {xIteratorBuilder} = table;
            const merges = table.getTableMerges();
            const cells = table.getTableCells();
            const {xMergesItems} = merges;
            // 创建工作表
            const worksheet = workbook.addWorksheet(tab.name);
            // 默认宽高
            worksheet.defaultRowHeight = rows.getDefaultHeight();
            worksheet.defaultColWidth = cols.getDefaultWidth();
            // 是否显示网格
            worksheet.views = [{showGridLines: settings.table.showGrid}];
            // 处理列宽
            const sheetColumns = [];
            cols.eachWidth(0, this.last(cols.len), (idx, width) => {
                sheetColumns.push({width: this.convertWidth(width)});
            });
            worksheet.columns = sheetColumns;
            // 处理数据
            xIteratorBuilder.getRowIterator()
                .foldOnOff(false)
                .setBegin(0)
                .setEnd(this.last(rows.len))
                .setLoop((row) => {
                    const workRow = worksheet.getRow(this.next(row));
                    workRow.height = this.convertHeight(rows.getHeight(row));
                    xIteratorBuilder.getColIterator()
                        .setBegin(0)
                        .setEnd(this.last(cols.len))
                        .setLoop((col) => {
                            const cell = cells.getCell(row, col);
                            if (cell) {
                                const {fontAttr, borderAttr} = cell;
                                const workCell = workRow.getCell(this.next(col));
                                workCell.value = cell.text;
                                workCell.font = {
                                    name: fontAttr.name,
                                    size: this.convertFontSize(fontAttr.size),
                                    color: {argb: fontAttr.color},
                                    bold: fontAttr.bold,
                                    italic: fontAttr.italic,
                                    underline: fontAttr.underline,
                                    strike: fontAttr.strikethrough
                                }
                                workCell.alignment = {
                                    vertical: fontAttr.verticalAlign,
                                    horizontal: fontAttr.align,
                                    wrapText: fontAttr.textWrap === BaseFont.TEXT_WRAP.WORD_WRAP
                                }
                                workCell.border = {};
                                if (borderAttr.top.display) {
                                    workCell.border.top = {};
                                    workCell.border.top.style = this.convertBorderType(borderAttr.top.widthType);
                                    workCell.border.top.color = { argb: borderAttr.top.color };
                                }
                                if (borderAttr.left.display) {
                                    workCell.border.left = {};
                                    workCell.border.left.style = this.convertBorderType(borderAttr.left.widthType);
                                    workCell.border.left.color = { argb: borderAttr.left.color };
                                }
                                if (borderAttr.right.display) {
                                    workCell.border.right = {};
                                    workCell.border.right.style = this.convertBorderType(borderAttr.right.widthType);
                                    workCell.border.right.color = { argb: borderAttr.right.color };
                                }
                                if (borderAttr.bottom.display) {
                                    workCell.border.bottom = {};
                                    workCell.border.bottom.style = this.convertBorderType(borderAttr.bottom.widthType);
                                    workCell.border.bottom.color = { argb: borderAttr.bottom.color };
                                }
                            }
                        })
                        .execute();
                })
                .execute();
            // 处理合并
            xMergesItems.getItems()
                .forEach((xMergeRange) => {
                    if (xMergeRange) {
                        const {sri, sci, eri, eci} = xMergeRange;
                        worksheet.mergeCells(
                            this.next(sri.no),
                            this.next(sci.no),
                            this.next(eri.no),
                            this.next(eci.no),
                        );
                    }
                });
        });
        // 导出XLSX
        workbook.xlsx
            .writeBuffer().then((data) => {
            Download(new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }), `${work.options.name}.xlsx`);
        });
    }

    static convertWidth(value) {
        // 8.11 / 64.8
        return value * 0.1251543209876543;
    }

    static convertHeight(value) {
        // 13.2 / 20
        return value * 0.6599999999999999;
    }

    static convertFontSize(value) {
        // 16 / 24
        return value * 0.6666666666666666
    }

    static convertBorderType(value) {
        switch (value) {
            case XDraw.LINE_WIDTH_TYPE.low:
                return 'thin';
            case XDraw.LINE_WIDTH_TYPE.medium:
                return 'medium';
            case XDraw.LINE_WIDTH_TYPE.high:
                return 'thick';
        }
    }

}

export {
    XlsxExport,
};
