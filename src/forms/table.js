class Table {

  constructor(tablename) {
    this.tablename = tablename;
  }

  /**
   * @param {Field[]} fields
   */
  set fields(fields) {
    this._fields = fields;
  }

  get fields() {
    return this._fields;
  }

  /**
   * @param {Object[]} children
   */
  set children(children) {
    this._children = children;
  }

  get children() {
    return this._children;
  }

  init() {}
  load() {}
  reset() {}
  validate() {}
  add() {
    // this.children.push({})
  }
  remove() {}

}

export default Table