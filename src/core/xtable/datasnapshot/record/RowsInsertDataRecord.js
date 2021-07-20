class RowsInsertDataRecord {

  constructor({
    subItems = [],
    ri = 0,
    type = RowsInsertDataRecord.TYPE.AFTER,
  }) {
    this.type = type;
    this.ri = ri;
    this.subItems = subItems;
  }

}

RowsInsertDataRecord.TYPE = {
  BEFORE: 1,
  AFTER: 2,
};

export {
  RowsInsertDataRecord,
};
