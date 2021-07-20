class RowsInsertDataRecord {

  constructor({
    ri = 0,
    type = RowsInsertDataRecord.TYPE.AFTER,
  }) {
    this.ri = ri;
    this.type = type;
  }

}

RowsInsertDataRecord.TYPE = {
  BEFORE: 1,
  AFTER: 2,
};

export {
  RowsInsertDataRecord,
};
